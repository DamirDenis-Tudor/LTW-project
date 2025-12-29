package application.input

data class DeliverableInput(
    val description: String,
    val dueDate: String,
    val assignedTo: String? = null
)