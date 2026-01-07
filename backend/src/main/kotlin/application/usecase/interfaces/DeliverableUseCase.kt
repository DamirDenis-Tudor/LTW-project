package application.usecase.interfaces

import application.common.Page
import application.input.DeliverableInputContract
import application.common.UserJwt
import domain.model.Deliverable
import domain.model.WorkPackage
import domain.model.User

interface DeliverableUseCase {
    fun getDeliverablesByWorkPackageId(workPackageId: String, limit: Int, offset: Int, status: Boolean? = null, user: UserJwt): Page<Deliverable>
    fun getDeliverableWorkPackage(deliverableId: String): WorkPackage?
    fun getDeliverableAssignedUser(deliverableId: String): User?
    fun createDeliverable(wpId: String, dto: DeliverableInputContract): Deliverable
    fun updateDeliverableStatus(id: String, status: Boolean, user: UserJwt): Deliverable
}