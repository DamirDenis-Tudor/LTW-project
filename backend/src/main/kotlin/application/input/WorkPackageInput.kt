package application.input

interface WorkPackageInputContract {
    val projectId: String
    val wpNumber: Int
    val title: String
    val leadPartnerId: String
}