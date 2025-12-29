package domain.repository

import domain.model.Organization

interface OrganizationRepository {
    fun findAll(limit: Int, offset: Int): List<Organization>
    fun findById(id: String): Organization?
    fun save(organization: Organization): Organization
}