package application.usecase.interfaces

import application.context.UserJwt
import application.input.WorkPackageInput
import domain.model.WorkPackage

interface WorkPackageUseCase {
    fun getWorkPackagesByProjectId(projectId: String, limit: Int, offset: Int, user: UserJwt): List<WorkPackage>
    fun getWorkPackageById(id: String, user: UserJwt): WorkPackage?
    fun createWorkPackage(dto: WorkPackageInput, user: UserJwt): WorkPackage
    fun deleteWorkPackage(id: String): Boolean
}