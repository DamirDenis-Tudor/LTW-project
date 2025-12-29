package domain.model.contracts

interface DeliverableContract {
    val id: String
    val workPackageId: String
    val description: String
    val dueDate: String
    val isSubmitted: Boolean
    val assignedTo: String?
}