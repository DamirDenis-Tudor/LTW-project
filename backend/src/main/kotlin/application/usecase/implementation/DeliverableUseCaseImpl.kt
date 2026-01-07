package application.usecase.implementation

import application.common.Page
import application.input.DeliverableInputContract
import application.common.UserJwt
import application.usecase.interfaces.DeliverableUseCase
import application.exception.NotFoundException
import application.exception.AuthorizationException
import domain.model.Deliverable
import domain.model.WorkPackage
import domain.model.User
import domain.model.UserRole
import domain.repository.DeliverableRepository
import domain.repository.ProjectRepository
import domain.repository.WorkPackageRepository
import domain.repository.UserRepository
import java.util.*

class DeliverableUseCaseImpl(
    private val deliverableRepository: DeliverableRepository,
    private val projectRepository: ProjectRepository,
    private val workPackageRepository: WorkPackageRepository,
    private val userRepository: UserRepository
) : DeliverableUseCase {

    override fun getDeliverablesByWorkPackageId(
        workPackageId: String,
        limit: Int,
        offset: Int,
        status: Boolean?,
        user: UserJwt
    ): Page<Deliverable> {
        val deliverables = if (status != null) {
            deliverableRepository.findByWorkPackageIdAndStatus(workPackageId, status, minOf(limit, 100), offset)
        } else {
            deliverableRepository.findByWorkPackageId(workPackageId, minOf(limit, 100), offset)
        }

        val totalCount = if (status != null) {
            deliverableRepository.countByWorkPackageIdAndStatus(workPackageId, status)
        } else {
            deliverableRepository.countByWorkPackageId(workPackageId)
        }

        return Page(
            items = deliverables,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun getDeliverableWorkPackage(deliverableId: String): WorkPackage? {
        val deliverable = deliverableRepository.findById(deliverableId)
        return deliverable?.let { workPackageRepository.findById(it.workPackageId) }
    }

    override fun getDeliverableAssignedUser(deliverableId: String): User? {
        val deliverable = deliverableRepository.findById(deliverableId)
        return deliverable?.assignedTo?.let { userRepository.findById(it).getOrNull() }
    }

    override fun createDeliverable(wpId: String, dto: DeliverableInputContract): Deliverable {
        workPackageRepository.findById(wpId) ?: throw NotFoundException("WorkPackage not found")
        dto.assignedTo?.let { userId ->
            userRepository.findById(userId).getOrNull() ?: throw NotFoundException("Assigned user not found")
        }

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
        val deliverable = deliverableRepository.findById(id) ?: throw NotFoundException("Deliverable not found")

        val canUpdate = when (user.role) {
            UserRole.ADMIN -> true
            UserRole.MANAGER -> projectRepository.isUserManagerOfWorkPackage(user.id, deliverable.workPackageId)
            UserRole.PARTNER -> deliverable.assignedTo == user.id
        }

        if (!canUpdate) throw AuthorizationException("Not authorized to update this deliverable")

        val updated = deliverable.copy(isSubmitted = status)
        return deliverableRepository.save(updated)
    }
}