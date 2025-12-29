package infrastructure.persistence.repositories

import domain.model.Organization
import domain.repository.OrganizationRepository

class InMemoryOrganizationRepository : OrganizationRepository {
    private val organizations = mutableListOf<Organization>()

    override fun findAll(limit: Int, offset: Int): List<Organization> =
        organizations.drop(offset).take(minOf(limit, 100))

    override fun findById(id: String): Organization? = organizations.find { it.id == id }

    override fun save(organization: Organization): Organization {
        organizations.removeIf { it.id == organization.id }
        organizations.add(organization)
        return organization
    }
}