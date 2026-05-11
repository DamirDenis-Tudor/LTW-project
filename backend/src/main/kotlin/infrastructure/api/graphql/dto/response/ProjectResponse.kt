package infrastructure.api.graphql.dto.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.ProjectContract
import domain.model.ProjectStatus
import application.usecase.interfaces.UserUseCase
import application.usecase.interfaces.ProjectUseCase
import application.usecase.interfaces.WorkPackageUseCase
import infrastructure.api.graphql.dto.page.PaginatedWorkPackages
import infrastructure.api.graphql.dto.page.PaginatedUsers
import graphql.schema.DataFetchingEnvironment
import infrastructure.api.graphql.context.requireUser
import infrastructure.api.graphql.context.validateRoles
import domain.model.UserRole

@GraphQLDescription("Project response with additional GraphQL fields")
class ProjectResponse(
    private val project: ProjectContract
) : ProjectContract by project {

    private val workPackageUseCase = GlobalContext.get().get<WorkPackageUseCase>()
    private val userUseCase = GlobalContext.get().get<UserUseCase>()
    private val projectUseCase = GlobalContext.get().get<ProjectUseCase>()

    @GraphQLDescription("Unique identifier for the project")
    override val id: String get() = project.id
    
    @GraphQLDescription("Title of the project")
    override val title: String get() = project.title
    
    @GraphQLDescription("Acronym of the project")
    override val acronym: String get() = project.acronym
    
    @GraphQLDescription("Current status of the project")
    override val status: ProjectStatus get() = project.status

    @GraphQLDescription("Get paginated work packages for this project")
    fun workPackages(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedWorkPackages = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        val page = workPackageUseCase.getWorkPackagesByProjectIdPaginated(project.id, limit, offset)
        val workPackages = page.items.map { WorkPackageResponse(it) }
        PaginatedWorkPackages(
            items = workPackages,
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }

    @GraphQLDescription("Get paginated partner users for this project")
    fun partners(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedUsers = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        val partnerIdsPage = projectUseCase.getProjectPartners(project.id, limit, offset)
        val partners = userUseCase.getUsersByIds(partnerIdsPage.items)
            .map { UserResponse(it) }
        PaginatedUsers(
            items = partners,
            totalCount = partnerIdsPage.totalCount,
            hasNextPage = partnerIdsPage.hasNextPage
        )
    }

    @GraphQLDescription("Get paginated manager users for this project (Admin only)")
    fun managers(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedUsers = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val managerIdsPage = projectUseCase.getProjectManagers(project.id, limit, offset)
        val managers = userUseCase.getUsersByIds(managerIdsPage.items)
            .map { UserResponse(it) }
        PaginatedUsers(
            items = managers,
            totalCount = managerIdsPage.totalCount,
            hasNextPage = managerIdsPage.hasNextPage
        )
    }
}