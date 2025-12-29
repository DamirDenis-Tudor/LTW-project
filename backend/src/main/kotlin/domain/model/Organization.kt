package domain.model

import domain.model.contracts.OrganizationContract

data class Organization(
    override val id: String,
    override val name: String,
    override val picCode: Int,
    override val country: String
) : OrganizationContract