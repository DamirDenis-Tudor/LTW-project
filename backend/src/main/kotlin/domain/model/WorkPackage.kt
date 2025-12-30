package domain.model

import domain.model.contracts.WorkPackageContract

data class WorkPackage(
    override val id: String,
    val projectId: String,
    override val wpNumber: Int,
    override val title: String,
    val leadPartnerId: String
) : WorkPackageContract