package application.usecase.implementation

import application.context.UserJwt
import application.input.WorkPackageInput
import application.usecase.interfaces.WorkPackageUseCase
import domain.model.WorkPackage
import domain.repository.WorkPackageRepository
import java.util.*

class WorkPackageUseCaseImpl(private val workPackageRepository: WorkPackageRepository) : WorkPackageUseCase {

    override fun getWorkPackagesByProjectId(projectId: String, limit: Int, offset: Int, user: UserJwt): List<WorkPackage> {
        return workPackageRepository.findByProjectId(projectId, minOf(limit, 100), offset)
    }

    override fun getWorkPackageById(id: String, user: UserJwt): WorkPackage? {
        return workPackageRepository.findById(id)
    }

    override fun createWorkPackage(dto: WorkPackageInput, user: UserJwt): WorkPackage {
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