package infrastructure.persistence.inmemory

import domain.model.Organization
import domain.repository.OrganizationRepository
import org.slf4j.LoggerFactory

class InMemoryOrganizationRepository : OrganizationRepository {
    private val log = LoggerFactory.getLogger(javaClass)
    private val organizations = mutableListOf<Organization>()

    override fun findAll(limit: Int, offset: Int): List<Organization> {
        log.info("findAll(limit=$limit, offset=$offset) -> ${organizations.size} total")
        return organizations.drop(offset).take(minOf(limit, 100))
    }

    override fun count(): Int = organizations.size

    override fun findById(id: String): Organization? {
        log.info("findById(id=$id)")
        return organizations.find { it.id == id }
    }

    override fun save(organization: Organization): Organization {
        log.info("save(id=${organization.id}, name=${organization.name})")
        organizations.removeIf { it.id == organization.id }
        organizations.add(organization)
        return organization
    }
}
