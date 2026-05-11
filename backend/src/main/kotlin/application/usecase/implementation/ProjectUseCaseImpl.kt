package application.usecase.implementation

import application.common.Page
import application.input.ProjectInputContract
import application.common.UserJwt
import application.usecase.interfaces.ProjectUseCase
import domain.model.*
import domain.repository.ProjectRepository
import application.exception.NotFoundException
import application.exception.AuthorizationException
import application.exception.AlreadyExistsException
import org.slf4j.LoggerFactory
import java.util.*

class ProjectUseCaseImpl(private val projectRepository: ProjectRepository) : ProjectUseCase {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun getAllProjects(limit: Int, offset: Int, user: UserJwt): Page<Project> {
        val projects = when (user.role) {
            UserRole.ADMIN -> projectRepository.findAll(minOf(limit, 100), offset)
            UserRole.MANAGER -> projectRepository.findByManagerId(user.id, minOf(limit, 100), offset)
            UserRole.PARTNER -> projectRepository.findByPartnerId(user.id, minOf(limit, 100), offset)
        }
        val totalCount = when (user.role) {
            UserRole.ADMIN -> projectRepository.count()
            UserRole.MANAGER -> projectRepository.countByManagerId(user.id)
            UserRole.PARTNER -> projectRepository.countByPartnerId(user.id)
        }
        return Page(
            items = projects,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun getProjectById(id: String, user: UserJwt): Project? {
        val project = projectRepository.findById(id) ?: throw NotFoundException("Project not found")
        return when (user.role) {
            UserRole.ADMIN -> project
            UserRole.MANAGER -> if (user.id in project.managerIds) project else throw AuthorizationException("Access denied")
            UserRole.PARTNER -> if (user.id in project.partnerIds) project else throw AuthorizationException("Access denied")
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
        log.info("createProject(title=${dto.title}, acronym=${dto.acronym})")
        var managerIds = ArrayList<String>()
        if (user.role == UserRole.MANAGER) managerIds.add(user.id)
        val project = Project(
            id = UUID.randomUUID().toString(),
            title = dto.title,
            acronym = dto.acronym,
            status = dto.status,
            workPackageIds = emptyList(),
            managerIds = managerIds
        )
        return projectRepository.save(project)
    }

    override fun deleteProject(id: String): Boolean {
        projectRepository.findById(id) ?: throw NotFoundException("Project not found")
        projectRepository.delete(id)
        return true
    }

    override fun updateProject(id: String, dto: ProjectInputContract): Project {
        val project = projectRepository.findById(id) ?: throw NotFoundException("Project not found")
        val updatedProject = project.copy(
            title = dto.title,
            acronym = dto.acronym,
            status = dto.status
        )
        return projectRepository.save(updatedProject)
    }

    override fun addPartnerToProject(projectId: String, partnerId: String, user: UserJwt): Project {
        val existingProject = projectRepository.findById(projectId) ?: throw NotFoundException("Project not found")
        if (partnerId in existingProject.partnerIds) throw AlreadyExistsException("Partner already assigned to project")
        return projectRepository.addPartnerToProject(projectId, partnerId)!!
    }

    override fun addManagerToProject(projectId: String, managerId: String, user: UserJwt): Project {
        val existingProject = projectRepository.findById(projectId) ?: throw NotFoundException("Project not found")
        if (managerId in existingProject.managerIds) throw AlreadyExistsException("Manager already assigned to project")
        return projectRepository.addManagerToProject(projectId, managerId)!!
    }

    override fun addWorkPackageToProject(projectId: String, workPackageId: String, user: UserJwt): Project {
        val existingProject = projectRepository.findById(projectId) ?: throw NotFoundException("Project not found")
        if (workPackageId in existingProject.workPackageIds) throw AlreadyExistsException("WorkPackage already assigned to project")
        return projectRepository.addWorkPackageToProject(projectId, workPackageId)!!
    }

    override fun removePartnerFromProject(projectId: String, partnerId: String, user: UserJwt): Project {
        projectRepository.findById(projectId) ?: throw NotFoundException("Project not found")
        return projectRepository.removePartnerFromProject(projectId, partnerId) ?: throw NotFoundException("Partner not found in project")
    }

    override fun removeManagerFromProject(projectId: String, managerId: String, user: UserJwt): Project {
        projectRepository.findById(projectId) ?: throw NotFoundException("Project not found")
        return projectRepository.removeManagerFromProject(projectId, managerId) ?: throw NotFoundException("Manager not found in project")
    }
}