package infrastructure.graphql.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.WorkPackageContract
import domain.repository.*
import infrastructure.graphql.response.page.PaginatedDeliverables

@GraphQLDescription("Work package response with additional GraphQL fields")
class WorkPackageResponse(
    private val workPackage: WorkPackageContract
) : WorkPackageContract by workPackage {

    private val deliverableRepository = GlobalContext.get().get<DeliverableRepository>()
    private val projectRepository = GlobalContext.get().get<ProjectRepository>()
    private val userRepository = GlobalContext.get().get<UserRepository>()

    @GraphQLDescription("Get paginated deliverables for this work package")
    fun deliverables(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedDeliverables {
        val deliverables = deliverableRepository.findByWorkPackageId(workPackage.id, limit, offset)
        val totalCount = deliverableRepository.countByWorkPackageId(workPackage.id)
        val paginatedItems = deliverables.map { DeliverableResponse(it) }
        return PaginatedDeliverables(
            items = paginatedItems,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }
    
    @GraphQLDescription("Get the project this work package belongs to")
    fun project(): ProjectResponse? {
        return projectRepository.findById(workPackage.projectId)
            ?.let { ProjectResponse(it) }
    }
    
    @GraphQLDescription("Get the lead partner user for this work package")
    fun leadPartner(): UserResponse? {
        return userRepository.findById(workPackage.leadPartnerId).getOrNull()
            ?.let { UserResponse(it) }
    }
}