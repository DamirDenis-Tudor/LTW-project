package application.usecase.interfaces

import domain.model.Organization

interface OrganizationUseCase {
    fun getOrganizations(limit: Int, offset: Int): List<Organization>
}