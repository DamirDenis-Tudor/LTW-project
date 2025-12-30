package application.usecase.implementation

import application.common.Page
import application.usecase.interfaces.OrganizationUseCase
import domain.model.Organization
import domain.model.User
import domain.repository.OrganizationRepository
import domain.repository.UserRepository

class OrganizationUseCaseImpl(
    private val organizationRepository: OrganizationRepository,
    private val userRepository: UserRepository
) : OrganizationUseCase {
    
    override fun getOrganizations(limit: Int, offset: Int): Page<Organization> {
        val organizations = organizationRepository.findAll(minOf(limit, 100), offset)
        val totalCount = organizationRepository.count()
        return Page(
            items = organizations,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun getOrganizationUsers(organizationId: String, limit: Int, offset: Int): Page<User> {
        val users = userRepository.findByOrganizationId(organizationId, minOf(limit, 100), offset)
        val totalCount = userRepository.countByOrganizationId(organizationId)
        return Page(
            items = users,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }
}