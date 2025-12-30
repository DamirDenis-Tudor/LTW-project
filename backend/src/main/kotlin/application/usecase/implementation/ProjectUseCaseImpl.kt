package application.usecase.implementation

import application.common.Page
import application.input.ProjectInputContract
import application.common.UserJwt
import application.usecase.interfaces.ProjectUseCase
import domain.model.*
import domain.repository.ProjectRepository
import java.util.*

class ProjectUseCaseImpl(private val projectRepository: ProjectRepository) : ProjectUseCase {
    
    override fun getAllProjects(limit: Int, offset: Int, user: UserJwt): Page<Project> {
        val projects = when (user.role) {
            UserRole.ADMIN -> projectRepository.findAll(minOf(limit, 100), offset)
            UserRole.MANAGER -> projectRepository.findByManagerId(user.id, minOf(limit, 100), offset)
            UserRole.PARTNER -> projectRepository.findByPartnerId(user.organizationId ?: "", minOf(limit, 100), offset)
        }
        val totalCount = when (user.role) {
            UserRole.ADMIN -> projectRepository.count()
            UserRole.MANAGER -> projectRepository.countByManagerId(user.id)
            UserRole.PARTNER -> projectRepository.countByPartnerId(user.organizationId ?: "")
        }
        return Page(
            items = projects,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun getProjectById(id: String, user: UserJwt): Project? {
        val project = projectRepository.findById(id) ?: return null
        return when (user.role) {
            UserRole.ADMIN -> project
            UserRole.MANAGER -> if (user.id in project.managerIds) project else null
            UserRole.PARTNER -> if (user.organizationId in project.partnerIds) project else null
        }
    }

    override fun getProjectPartners(projectId: String, limit: Int, offset: Int): Page<String> {
        val partnerIds = projectRepository.findPartnersByProjectId(projectId, limit, offset)
        val totalCount = projectRepository.countPartnersByProjectId(projectId)
        return Page(
            items = partnerIds,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun getProjectManagers(projectId: String, limit: Int, offset: Int): Page<String> {
        val managerIds = projectRepository.findManagersByProjectId(projectId, limit, offset)
        val totalCount = projectRepository.countManagersByProjectId(projectId)
        return Page(
            items = managerIds,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun createProject(dto: ProjectInputContract, user: UserJwt): Project {
        val project = Project(
            id = UUID.randomUUID().toString(),
            title = dto.title,
            acronym = dto.acronym,
            status = dto.status,
            workPackageIds = emptyList()
        )
        return projectRepository.save(project)
    }

    override fun deleteProject(id: String): Boolean {
        projectRepository.delete(id)
        return true
    }

    override fun addPartnerToProject(projectId: String, partnerId: String, user: UserJwt): Project {
        val project = projectRepository.findById(projectId) ?: throw IllegalArgumentException("Project not found")
        val updatedProject = project.copy(partnerIds = project.partnerIds + partnerId)
        return projectRepository.save(updatedProject)
    }

    override fun addWorkPackageToProject(projectId: String, workPackageId: String, user: UserJwt): Project {
        val project = projectRepository.findById(projectId) ?: throw IllegalArgumentException("Project not found")
        val updatedProject = project.copy(workPackageIds = project.workPackageIds + workPackageId)
        return projectRepository.save(updatedProject)
    }

    override fun addManagerToProject(projectId: String, managerId: String, user: UserJwt): Project {
        val project = projectRepository.findById(projectId) ?: throw IllegalArgumentException("Project not found")
        val updatedProject = project.copy(managerIds = project.managerIds + managerId)
        return projectRepository.save(updatedProject)
    }
}