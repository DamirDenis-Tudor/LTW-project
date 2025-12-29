package application.usecase.interfaces

import application.input.ProjectInput
import application.context.UserJwt
import domain.model.Project

interface ProjectUseCase {
    fun getAllProjects(limit: Int, offset: Int, user: UserJwt): List<Project>
    fun getProjectById(id: String, user: UserJwt): Project?
    fun createProject(dto: ProjectInput, user: UserJwt): Project
    fun deleteProject(id: String): Boolean
    fun addPartnerToProject(projectId: String, partnerId: String, user: UserJwt): Project
    fun addWorkPackageToProject(projectId: String, workPackageId: String, user: UserJwt): Project
    fun addManagerToProject(projectId: String, managerId: String, user: UserJwt): Project
}