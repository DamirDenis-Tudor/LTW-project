package infrastructure.persistence.inmemory

import domain.model.Project
import domain.repository.ProjectRepository
import org.slf4j.LoggerFactory

class InMemoryProjectRepository : ProjectRepository {
    private val log = LoggerFactory.getLogger(javaClass)
    private val projects = mutableListOf<Project>()

    override fun findAll(limit: Int, offset: Int): List<Project> {
        log.info("findAll(limit=$limit, offset=$offset) -> ${projects.size} total")
        return projects.drop(offset).take(minOf(limit, 100))
    }

    override fun count(): Int = projects.size

    override fun findById(id: String): Project? {
        log.info("findById(id=$id)")
        return projects.find { it.id == id }
    }

    override fun findByManagerId(managerId: String, limit: Int, offset: Int): List<Project> =
        projects.filter { managerId in it.managerIds }.drop(offset).take(minOf(limit, 100))

    override fun findByPartnerId(partnerId: String, limit: Int, offset: Int): List<Project> =
        projects.filter { partnerId in it.partnerIds }.drop(offset).take(minOf(limit, 100))

    override fun countByManagerId(managerId: String): Int =
        projects.count { managerId in it.managerIds }

    override fun countByPartnerId(partnerId: String): Int =
        projects.count { partnerId in it.partnerIds }

    override fun findPartnersByProjectId(projectId: String, limit: Int, offset: Int): List<String> =
        projects.find { it.id == projectId }?.partnerIds?.drop(offset)?.take(minOf(limit, 100)) ?: emptyList()

    override fun findManagersByProjectId(projectId: String, limit: Int, offset: Int): List<String> =
        projects.find { it.id == projectId }?.managerIds?.drop(offset)?.take(minOf(limit, 100)) ?: emptyList()

    override fun countPartnersByProjectId(projectId: String): Int =
        projects.find { it.id == projectId }?.partnerIds?.size ?: 0

    override fun countManagersByProjectId(projectId: String): Int =
        projects.find { it.id == projectId }?.managerIds?.size ?: 0

    override fun isUserManagerOfWorkPackage(userId: String, workPackageId: String): Boolean =
        projects.any { project -> userId in project.managerIds && workPackageId in project.workPackageIds }

    override fun save(project: Project): Project {
        log.info("save(id=${project.id}, title=${project.title})")
        projects.removeIf { it.id == project.id }
        projects.add(project)
        return project
    }

    override fun addWorkPackageToProject(projectId: String, workPackageId: String): Project? {
        val project = findById(projectId) ?: return null
        return save(project.copy(workPackageIds = project.workPackageIds + workPackageId))
    }

    override fun removeWorkPackageFromProject(projectId: String, workPackageId: String): Project? {
        val project = findById(projectId) ?: return null
        return save(project.copy(workPackageIds = project.workPackageIds - workPackageId))
    }

    override fun addPartnerToProject(projectId: String, partnerId: String): Project? {
        val project = findById(projectId) ?: return null
        if (partnerId in project.partnerIds) return project
        return save(project.copy(partnerIds = project.partnerIds + partnerId))
    }

    override fun removePartnerFromProject(projectId: String, partnerId: String): Project? {
        val project = findById(projectId) ?: return null
        return save(project.copy(partnerIds = project.partnerIds - partnerId))
    }

    override fun addManagerToProject(projectId: String, managerId: String): Project? {
        val project = findById(projectId) ?: return null
        if (managerId in project.managerIds) return project
        return save(project.copy(managerIds = project.managerIds + managerId))
    }

    override fun removeManagerFromProject(projectId: String, managerId: String): Project? {
        val project = findById(projectId) ?: return null
        return save(project.copy(managerIds = project.managerIds - managerId))
    }

    override fun delete(id: String) {
        log.info("delete(id=$id)")
        projects.removeIf { it.id == id }
    }
}
