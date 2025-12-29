package domain.model.contracts

interface WorkPackageContract {
    val id: String
    val projectId: String
    val wpNumber: Int
    val title: String
    val leadPartnerId: String
}