package application.usecase.implementation

import application.input.ProjectInput
import application.context.UserJwt
import application.usecase.interfaces.ProjectUseCase
import domain.model.*
import domain.repository.ProjectRepository
import java.util.*

class ProjectUseCaseImpl(private val projectRepository: ProjectRepository) : ProjectUseCase {
    
    override fun getAllProjects(limit: Int, offset: Int, user: UserJwt): List<Project> {
        val projects = projectRepository.findAll(minOf(limit, 100), offset)
        return when (user.role) {
            UserRole.ADMIN -> projects
            UserRole.MANAGER -> projects.filter { user.id in it.managerIds }
            UserRole.PARTNER -> projects.filter { user.organizationId in it.partnerIds }
        }
    }

    override fun getProjectById(id: String, user: UserJwt): Project? {
        val project = projectRepository.findById(id) ?: return null
        return when (user.role) {
            UserRole.ADMIN -> project
            UserRole.MANAGER -> if (user.id in project.managerIds) project else null
            UserRole.PARTNER -> if (user.organizationId in project.partnerIds) project else null
        }
    }

    override fun createProject(dto: ProjectInput, user: UserJwt): Project {
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