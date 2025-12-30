package infrastructure.graphql.dto.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.DeliverableContract
import application.usecase.interfaces.DeliverableUseCase

@GraphQLDescription("Deliverable response with additional GraphQL fields")
class DeliverableResponse(
    private val deliverable: DeliverableContract
) : DeliverableContract by deliverable {

    private val deliverableUseCase = GlobalContext.get().get<DeliverableUseCase>()
    
    @GraphQLDescription("Unique identifier for the deliverable")
    override val id: String get() = deliverable.id
    
    @GraphQLDescription("ID of the work package this deliverable belongs to")
    override val workPackageId: String get() = deliverable.workPackageId
    
    @GraphQLDescription("Description of the deliverable")
    override val description: String get() = deliverable.description
    
    @GraphQLDescription("Due date for the deliverable")
    override val dueDate: String get() = deliverable.dueDate
    
    @GraphQLDescription("Whether the deliverable has been submitted")
    override val isSubmitted: Boolean get() = deliverable.isSubmitted
    
    @GraphQLDescription("ID of the user assigned to this deliverable")
    override val assignedTo: String? get() = deliverable.assignedTo
    
    @GraphQLDescription("Get the work package this deliverable belongs to")
    fun workPackage(): WorkPackageResponse? {
        return deliverableUseCase.getDeliverableWorkPackage(deliverable.id)
            ?.let { WorkPackageResponse(it) }
    }
    
    @GraphQLDescription("Get the user assigned to this deliverable")
    fun assignedUser(): UserResponse? {
        return deliverableUseCase.getDeliverableAssignedUser(deliverable.id)
            ?.let { UserResponse(it) }
    }
}