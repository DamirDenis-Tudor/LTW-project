package application.usecase.implementation

import application.common.UserJwt
import application.input.WorkPackageInputContract
import application.usecase.interfaces.WorkPackageUseCase
import application.common.Page
import domain.model.WorkPackage
import domain.model.Project
import domain.model.User
import domain.repository.WorkPackageRepository
import domain.repository.ProjectRepository
import domain.repository.UserRepository
import java.util.*

class WorkPackageUseCaseImpl(
    private val workPackageRepository: WorkPackageRepository,
    private val projectRepository: ProjectRepository,
    private val userRepository: UserRepository
) : WorkPackageUseCase {

    override fun getWorkPackagesByProjectId(projectId: String, limit: Int, offset: Int, user: UserJwt): List<WorkPackage> {
        return workPackageRepository.findByProjectId(projectId, minOf(limit, 100), offset)
    }

    override fun getWorkPackagesByProjectIdPaginated(projectId: String, limit: Int, offset: Int): Page<WorkPackage> {
        val workPackages = workPackageRepository.findByProjectId(projectId, minOf(limit, 100), offset)
        val totalCount = workPackageRepository.countByProjectId(projectId)
        return Page(
            items = workPackages,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun getWorkPackageById(id: String, user: UserJwt): WorkPackage? {
        return workPackageRepository.findById(id)
    }

    override fun getWorkPackageProject(workPackageId: String): Project? {
        val workPackage = workPackageRepository.findById(workPackageId)
        return workPackage?.let { projectRepository.findById(it.projectId) }
    }

    override fun getWorkPackageLeadPartner(workPackageId: String): User? {
        val workPackage = workPackageRepository.findById(workPackageId)
        return workPackage?.let { userRepository.findById(it.leadPartnerId).getOrNull() }
    }

    override fun createWorkPackage(dto: WorkPackageInputContract, user: UserJwt): WorkPackage {
        val workPackage = WorkPackage(
            id = UUID.randomUUID().toString(),
            projectId = dto.projectId,
            wpNumber = dto.wpNumber,
            title = dto.title,
            leadPartnerId = dto.leadPartnerId
        )
        return workPackageRepository.save(workPackage)
    }

    override fun deleteWorkPackage(id: String): Boolean {
        workPackageRepository.delete(id)
        return true
    }
}