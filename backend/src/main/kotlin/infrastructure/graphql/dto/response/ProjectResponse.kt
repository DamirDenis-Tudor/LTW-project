package infrastructure.graphql.dto.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.ProjectContract
import domain.model.ProjectStatus
import application.usecase.interfaces.UserUseCase
import application.usecase.interfaces.ProjectUseCase
import application.usecase.interfaces.WorkPackageUseCase
import infrastructure.graphql.dto.page.PaginatedWorkPackages
import infrastructure.graphql.dto.page.PaginatedUsers

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
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedWorkPackages {
        val page = workPackageUseCase.getWorkPackagesByProjectIdPaginated(project.id, limit, offset)
        val workPackages = page.items.map { WorkPackageResponse(it) }
        return PaginatedWorkPackages(
            items = workPackages,
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }

    @GraphQLDescription("Get paginated partner users for this project")
    fun partners(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedUsers {
        val partnerIdsPage = projectUseCase.getProjectPartners(project.id, limit, offset)
        val partners = userUseCase.getUsersByIds(partnerIdsPage.items)
            .map { UserResponse(it) }
        return PaginatedUsers(
            items = partners,
            totalCount = partnerIdsPage.totalCount,
            hasNextPage = partnerIdsPage.hasNextPage
        )
    }

    @GraphQLDescription("Get paginated manager users for this project")
    fun managers(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedUsers {
        val managerIdsPage = projectUseCase.getProjectManagers(project.id, limit, offset)
        val managers = userUseCase.getUsersByIds(managerIdsPage.items)
            .map { UserResponse(it) }
        return PaginatedUsers(
            items = managers,
            totalCount = managerIdsPage.totalCount,
            hasNextPage = managerIdsPage.hasNextPage
        )
    }
}