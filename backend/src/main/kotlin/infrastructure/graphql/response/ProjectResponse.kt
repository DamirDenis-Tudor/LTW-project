package infrastructure.graphql.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.Project
import domain.model.contracts.ProjectContract
import domain.repository.*
import infrastructure.graphql.response.page.PaginatedWorkPackages
import infrastructure.graphql.response.page.PaginatedUsers

@GraphQLDescription("Project response with additional GraphQL fields")
class ProjectResponse(
    private val project: ProjectContract
) : ProjectContract by project {

    private val workPackageRepository = GlobalContext.get().get<WorkPackageRepository>()
    private val userRepository = GlobalContext.get().get<UserRepository>()
    private val projectRepository = GlobalContext.get().get<ProjectRepository>()

    @GraphQLDescription("Get paginated work packages for this project")
    fun workPackages(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedWorkPackages {
        val workPackages = workPackageRepository.findByProjectId(project.id, limit, offset)
        val totalCount = workPackageRepository.countByProjectId(project.id)
        val paginatedItems = workPackages.map { WorkPackageResponse(it) }
        return PaginatedWorkPackages(
            items = paginatedItems,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    @GraphQLDescription("Get paginated partner users for this project")
    fun partners(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedUsers {
        val partnerIds = projectRepository.findPartnersByProjectId(project.id, limit, offset)
        val partners = userRepository.findByIds(partnerIds)
            .map { UserResponse(it) }
        val totalCount = projectRepository.countPartnersByProjectId(project.id)
        return PaginatedUsers(
            items = partners,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    @GraphQLDescription("Get paginated manager users for this project")
    fun managers(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedUsers {
        val managerIds = projectRepository.findManagersByProjectId(project.id, limit, offset)
        val managers = userRepository.findByIds(managerIds)
            .map { UserResponse(it) }
        val totalCount = projectRepository.countManagersByProjectId(project.id)
        return PaginatedUsers(
            items = managers,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }
}