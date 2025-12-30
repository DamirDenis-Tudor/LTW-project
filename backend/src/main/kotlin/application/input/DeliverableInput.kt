package application.input

interface DeliverableInputContract {
    val description: String
    val dueDate: String
    val assignedTo: String?
}