package application.usecase.interfaces

import application.common.UserJwt
import application.input.WorkPackageInputContract
import application.common.Page
import domain.model.WorkPackage
import domain.model.Project
import domain.model.User

interface WorkPackageUseCase {
    fun getWorkPackagesByProjectId(projectId: String, limit: Int, offset: Int, user: UserJwt): List<WorkPackage>
    fun getWorkPackagesByProjectIdPaginated(projectId: String, limit: Int, offset: Int): Page<WorkPackage>
    fun getWorkPackageById(id: String, user: UserJwt): WorkPackage?
    fun getWorkPackageProject(workPackageId: String): Project?
    fun getWorkPackageLeadPartner(workPackageId: String): User?
    fun createWorkPackage(dto: WorkPackageInputContract, user: UserJwt): WorkPackage
    fun deleteWorkPackage(id: String): Boolean
}