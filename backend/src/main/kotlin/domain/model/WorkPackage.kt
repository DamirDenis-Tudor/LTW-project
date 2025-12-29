package domain.model

import domain.model.contracts.WorkPackageContract

data class WorkPackage(
    override val id: String,
    override val projectId: String,
    override val wpNumber: Int,
    override val title: String,
    override val leadPartnerId: String
) : WorkPackageContract