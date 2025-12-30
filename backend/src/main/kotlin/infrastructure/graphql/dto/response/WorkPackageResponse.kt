package infrastructure.graphql.dto.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.WorkPackageContract
import application.usecase.interfaces.DeliverableUseCase
import application.usecase.interfaces.WorkPackageUseCase
import infrastructure.graphql.dto.page.PaginatedDeliverables

@GraphQLDescription("Work package response with additional GraphQL fields")
class WorkPackageResponse(
    private val workPackage: WorkPackageContract
) : WorkPackageContract by workPackage {

    private val deliverableUseCase = GlobalContext.get().get<DeliverableUseCase>()
    private val workPackageUseCase = GlobalContext.get().get<WorkPackageUseCase>()

    @GraphQLDescription("Unique identifier for the work package")
    override val id: String get() = workPackage.id
    
    @GraphQLDescription("ID of the project this work package belongs to")
    override val projectId: String get() = workPackage.projectId
    
    @GraphQLDescription("Work package number")
    override val wpNumber: Int get() = workPackage.wpNumber
    
    @GraphQLDescription("Title of the work package")
    override val title: String get() = workPackage.title
    
    @GraphQLDescription("ID of the lead partner for this work package")
    override val leadPartnerId: String get() = workPackage.leadPartnerId

    @GraphQLDescription("Get paginated deliverables for this work package")
    fun deliverables(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedDeliverables {
        val page = deliverableUseCase.getDeliverablesByWorkPackageId(workPackage.id, limit, offset)
        val deliverables = page.items.map { DeliverableResponse(it) }
        return PaginatedDeliverables(
            items = deliverables,
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }
    
    @GraphQLDescription("Get the project this work package belongs to")
    fun project(): ProjectResponse? {
        return workPackageUseCase.getWorkPackageProject(workPackage.id)
            ?.let { ProjectResponse(it) }
    }
    
    @GraphQLDescription("Get the lead partner user for this work package")
    fun leadPartner(): UserResponse? {
        return workPackageUseCase.getWorkPackageLeadPartner(workPackage.id)
            ?.let { UserResponse(it) }
    }
}