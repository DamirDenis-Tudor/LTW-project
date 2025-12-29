package infrastructure.graphql.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.DeliverableContract
import domain.repository.*

@GraphQLDescription("Deliverable response with additional GraphQL fields")
class DeliverableResponse(
    private val deliverable: DeliverableContract
) : DeliverableContract by deliverable {

    private val workPackageRepository = GlobalContext.get().get<WorkPackageRepository>()
    private val userRepository = GlobalContext.get().get<UserRepository>()
    
    @GraphQLDescription("Get the work package this deliverable belongs to")
    fun workPackage(): WorkPackageResponse? {
        return workPackageRepository.findById(deliverable.workPackageId)
            ?.let { WorkPackageResponse(it) }
    }
    
    @GraphQLDescription("Get the user assigned to this deliverable")
    fun assignedUser(): UserResponse? {
        return deliverable.assignedTo?.let { userRepository.findById(it).getOrNull() }
            ?.let { UserResponse(it) }
    }
}