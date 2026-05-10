package application.usecase.interfaces

import application.common.Page
import domain.model.User
import domain.model.Organization
import domain.model.Project
import application.input.UserInputContract

interface UserUseCase {
    fun getAllUsers(limit: Int, offset: Int): Page<User>
    fun getUserById(id: String): User?
    fun getUsersByIds(ids: List<String>): List<User>
    fun getUserOrganization(userId: String): Organization?
    fun getUserManagedProjects(userId: String, limit: Int, offset: Int): Page<Project>
    fun getUserPartnerProjects(userId: String, limit: Int, offset: Int): Page<Project>
    fun createUser(dto: UserInputContract): User
    fun login(username: String, password: String): String?
}