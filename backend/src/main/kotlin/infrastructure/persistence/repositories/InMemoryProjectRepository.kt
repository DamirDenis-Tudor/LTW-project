package infrastructure.persistence.repositories

import domain.model.Project
import domain.repository.ProjectRepository

class InMemoryProjectRepository : ProjectRepository {
    private val projects = mutableListOf<Project>()

    override fun findAll(limit: Int, offset: Int): List<Project> =
        projects.drop(offset).take(minOf(limit, 100))

    override fun count(): Int = projects.size

    override fun findById(id: String): Project? = projects.find { it.id == id }

    override fun findByManagerId(managerId: String, limit: Int, offset: Int): List<Project> =
        projects.filter { managerId in it.managerIds }
            .drop(offset)
            .take(minOf(limit, 100))

    override fun findByPartnerId(partnerId: String, limit: Int, offset: Int): List<Project> =
        projects.filter { partnerId in it.partnerIds }
            .drop(offset)
            .take(minOf(limit, 100))

    override fun countByManagerId(managerId: String): Int =
        projects.count { managerId in it.managerIds }

    override fun countByPartnerId(partnerId: String): Int =
        projects.count { partnerId in it.partnerIds }

    override fun findPartnersByProjectId(projectId: String, limit: Int, offset: Int): List<String> =
        projects.find { it.id == projectId }?.partnerIds
            ?.drop(offset)?.take(minOf(limit, 100)) ?: emptyList()

    override fun findManagersByProjectId(projectId: String, limit: Int, offset: Int): List<String> =
        projects.find { it.id == projectId }?.managerIds
            ?.drop(offset)?.take(minOf(limit, 100)) ?: emptyList()

    override fun countPartnersByProjectId(projectId: String): Int =
        projects.find { it.id == projectId }?.partnerIds?.size ?: 0

    override fun countManagersByProjectId(projectId: String): Int =
        projects.find { it.id == projectId }?.managerIds?.size ?: 0

    override fun isUserManagerOfWorkPackage(userId: String, workPackageId: String): Boolean =
        projects.any { project ->
            userId in project.managerIds && workPackageId in project.workPackageIds
        }

    override fun save(project: Project): Project {
        projects.removeIf { it.id == project.id }
        projects.add(project)
        return project
    }

    override fun addWorkPackageToProject(projectId: String, workPackageId: String): Project? {
        val project = findById(projectId) ?: return null
        val updatedProject = project.copy(
            workPackageIds = project.workPackageIds + workPackageId
        )
        return save(updatedProject)
    }

    override fun removeWorkPackageFromProject(projectId: String, workPackageId: String): Project? {
        val project = findById(projectId) ?: return null
        val updatedProject = project.copy(
            workPackageIds = project.workPackageIds - workPackageId
        )
        return save(updatedProject)
    }

    override fun addPartnerToProject(projectId: String, partnerId: String): Project? {
        val project = findById(projectId) ?: return null
        if (partnerId in project.partnerIds) return project
        val updatedProject = project.copy(
            partnerIds = project.partnerIds + partnerId
        )
        return save(updatedProject)
    }

    override fun removePartnerFromProject(projectId: String, partnerId: String): Project? {
        val project = findById(projectId) ?: return null
        val updatedProject = project.copy(
            partnerIds = project.partnerIds - partnerId
        )
        return save(updatedProject)
    }

    override fun addManagerToProject(projectId: String, managerId: String): Project? {
        val project = findById(projectId) ?: return null
        if (managerId in project.managerIds) return project
        val updatedProject = project.copy(
            managerIds = project.managerIds + managerId
        )
        return save(updatedProject)
    }

    override fun removeManagerFromProject(projectId: String, managerId: String): Project? {
        val project = findById(projectId) ?: return null
        val updatedProject = project.copy(
            managerIds = project.managerIds - managerId
        )
        return save(updatedProject)
    }

    override fun delete(id: String) {
        projects.removeIf { it.id == id }
    }
}