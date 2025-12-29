package infrastructure.graphql.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.UserContract
import domain.repository.*
import infrastructure.graphql.response.page.PaginatedProjects

@GraphQLDescription("User response with additional GraphQL fields")
class UserResponse(
    private val user: UserContract
) : UserContract by user {

    private val organizationRepository = GlobalContext.get().get<OrganizationRepository>()
    private val projectRepository = GlobalContext.get().get<ProjectRepository>()

    @GraphQLDescription("Get the organization this user belongs to")
    fun organization(): OrganizationResponse? {
        return user.organizationId?.let { organizationRepository.findById(it) }
            ?.let { OrganizationResponse(it) }
    }
    
    @GraphQLDescription("Get projects where this user is a manager")
    fun managedProjects(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedProjects {
        val projects = projectRepository.findByManagerId(user.id, limit, offset)
        val totalCount = projectRepository.countByManagerId(user.id)
        val paginatedItems = projects.map { ProjectResponse(it) }
        return PaginatedProjects(
            items = paginatedItems,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }
    
    @GraphQLDescription("Get projects where this user is a partner")
    fun partnerProjects(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedProjects {
        val projects = projectRepository.findByPartnerId(user.id, limit, offset)
        val totalCount = projectRepository.countByPartnerId(user.id)
        val paginatedItems = projects.map { ProjectResponse(it) }
        return PaginatedProjects(
            items = paginatedItems,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }
}