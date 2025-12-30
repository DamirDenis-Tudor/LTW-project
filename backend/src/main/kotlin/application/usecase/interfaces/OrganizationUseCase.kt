package application.usecase.interfaces

import application.common.Page
import application.input.OrganizationInputContract
import domain.model.Organization
import domain.model.User

interface OrganizationUseCase {
    fun getOrganizations(limit: Int, offset: Int): Page<Organization>
    fun getOrganizationUsers(organizationId: String, limit: Int, offset: Int): Page<User>
    fun createOrganization(dto: OrganizationInputContract): Organization
}