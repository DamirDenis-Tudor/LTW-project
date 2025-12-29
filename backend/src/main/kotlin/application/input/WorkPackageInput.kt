package application.input

data class WorkPackageInput(
    val projectId: String,
    val wpNumber: Int,
    val title: String,
    val leadPartnerId: String
)