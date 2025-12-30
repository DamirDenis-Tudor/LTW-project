package application.usecase.interfaces

import application.common.Page
import application.input.ProjectInputContract
import application.common.UserJwt
import domain.model.Project

interface ProjectUseCase {
    fun getAllProjects(limit: Int, offset: Int, user: UserJwt): Page<Project>
    fun getProjectById(id: String, user: UserJwt): Project?
    fun getProjectPartners(projectId: String, limit: Int, offset: Int): Page<String>
    fun getProjectManagers(projectId: String, limit: Int, offset: Int): Page<String>
    fun createProject(dto: ProjectInputContract, user: UserJwt): Project
    fun deleteProject(id: String): Boolean
    fun addPartnerToProject(projectId: String, partnerId: String, user: UserJwt): Project
    fun addWorkPackageToProject(projectId: String, workPackageId: String, user: UserJwt): Project
    fun addManagerToProject(projectId: String, managerId: String, user: UserJwt): Project
}