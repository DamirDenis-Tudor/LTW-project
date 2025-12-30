package infrastructure.graphql.dto.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.UserContract
import domain.model.UserRole
import application.usecase.interfaces.UserUseCase
import infrastructure.graphql.dto.page.PaginatedProjects
import graphql.schema.DataFetchingEnvironment
import infrastructure.graphql.context.requireUser
import infrastructure.graphql.context.validateRoles
import application.exception.AuthorizationException

@GraphQLDescription("User response with additional GraphQL fields")
class UserResponse(
    private val user: UserContract
) : UserContract by user {

    private val userUseCase = GlobalContext.get().get<UserUseCase>()

    @GraphQLDescription("Unique identifier for the user")
    override val id: String get() = user.id
    
    @GraphQLDescription("Username of the user")
    override val username: String get() = user.username
    
    @GraphQLDescription("Email address of the user")
    override val email: String get() = user.email
    
    @GraphQLDescription("Role of the user in the system")
    override val role: UserRole get() = user.role
    
    @GraphQLDescription("ID of the organization this user belongs to")
    override val organizationId: String? get() = user.organizationId

    @GraphQLDescription("Get the organization this user belongs to")
    fun organization(dataFetchingEnvironment: DataFetchingEnvironment): OrganizationResponse? =
        dataFetchingEnvironment.graphQlContext.requireUser { user ->
            userUseCase.getUserOrganization(this.user.id)
                ?.let { OrganizationResponse(it) }
        }
    
    @GraphQLDescription("Get projects where this user is a manager")
    fun managedProjects(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedProjects = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.MANAGER)
    ) { user ->
        val page = userUseCase.getUserManagedProjects(this.user.id, limit, offset)
        val projects = page.items.map { ProjectResponse(it) }
        PaginatedProjects(
            items = projects,
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }
    
    @GraphQLDescription("Get projects where this user is a partner")
    fun partnerProjects(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedProjects = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.PARTNER)
    ) { user ->
        val page = userUseCase.getUserPartnerProjects(this.user.id, limit, offset)
        val projects = page.items.map { ProjectResponse(it) }
        PaginatedProjects(
            items = projects,
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }
}