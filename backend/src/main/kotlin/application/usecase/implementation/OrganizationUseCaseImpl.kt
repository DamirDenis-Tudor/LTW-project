package application.usecase.implementation

import application.usecase.interfaces.OrganizationUseCase
import domain.model.Organization
import domain.repository.OrganizationRepository

class OrganizationUseCaseImpl(private val organizationRepository: OrganizationRepository) : OrganizationUseCase {
    
    override fun getOrganizations(limit: Int, offset: Int): List<Organization> =
        organizationRepository.findAll(minOf(limit, 100), offset)
}