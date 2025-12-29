package application.usecase.implementation

import application.input.DeliverableInput
import application.context.UserJwt
import application.usecase.interfaces.DeliverableUseCase
import domain.model.Deliverable
import domain.model.UserRole
import domain.repository.DeliverableRepository
import domain.repository.ProjectRepository
import domain.repository.WorkPackageRepository
import java.util.*

class DeliverableUseCaseImpl(
    private val deliverableRepository: DeliverableRepository,
    private val projectRepository: ProjectRepository,
    private val workPackageRepository: WorkPackageRepository
) : DeliverableUseCase {
    
    override fun createDeliverable(wpId: String, dto: DeliverableInput): Deliverable {
        val deliverable = Deliverable(
            id = UUID.randomUUID().toString(),
            workPackageId = wpId,
            description = dto.description,
            dueDate = dto.dueDate,
            isSubmitted = false,
            assignedTo = dto.assignedTo
        )
        return deliverableRepository.save(deliverable)
    }

    override fun updateDeliverableStatus(id: String, status: Boolean, user: UserJwt): Deliverable {
        val deliverable = deliverableRepository.findById(id) ?: throw IllegalArgumentException("Deliverable not found")
        
        val canUpdate = when (user.role) {
            UserRole.ADMIN -> true
            UserRole.MANAGER -> {
                val managedProjects = projectRepository.findAll(1000, 0).filter { user.id in it.managerIds }
                managedProjects.any { project ->
                    project.workPackageIds.contains(deliverable.workPackageId)
                }
            }
            UserRole.PARTNER -> deliverable.assignedTo == user.id
        }
        
        if (!canUpdate) throw IllegalArgumentException("Not authorized to update this deliverable")
        
        val updated = deliverable.copy(isSubmitted = status)
        return deliverableRepository.save(updated)
    }
}