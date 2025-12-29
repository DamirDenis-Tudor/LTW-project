package application.usecase.interfaces

import application.input.DeliverableInput
import application.context.UserJwt
import domain.model.Deliverable

interface DeliverableUseCase {
    fun createDeliverable(wpId: String, dto: DeliverableInput): Deliverable
    fun updateDeliverableStatus(id: String, status: Boolean, user: UserJwt): Deliverable
}