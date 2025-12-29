package domain.model

import domain.model.contracts.DeliverableContract

data class Deliverable(
    override val id: String,
    override val workPackageId: String,
    override val description: String,
    override val dueDate: String,
    override val isSubmitted: Boolean,
    override val assignedTo: String? = null
) : DeliverableContract