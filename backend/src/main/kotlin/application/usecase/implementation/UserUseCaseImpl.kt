package application.usecase.implementation

import application.common.Page
import application.input.UserInputContract
import application.usecase.interfaces.UserUseCase
import domain.model.User
import domain.model.Organization
import domain.model.Project
import domain.repository.UserRepository
import domain.repository.OrganizationRepository
import domain.repository.ProjectRepository
import java.security.MessageDigest
import java.util.*

class UserUseCaseImpl(
    private val userRepository: UserRepository,
    private val organizationRepository: OrganizationRepository,
    private val projectRepository: ProjectRepository
) : UserUseCase {
    
    override fun getAllUsers(limit: Int, offset: Int): Page<User> {
        val users = userRepository.findAll(minOf(limit, 100), offset)
        val totalCount = userRepository.count()
        return Page(
            items = users,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun getUserById(id: String): User? = userRepository.findById(id).getOrNull()

    override fun getUsersByIds(ids: List<String>): List<User> = userRepository.findByIds(ids)

    override fun getUserOrganization(userId: String): Organization? {
        val user = userRepository.findById(userId).getOrNull()
        return user?.organizationId?.let { organizationRepository.findById(it) }
    }

    override fun getUserManagedProjects(userId: String, limit: Int, offset: Int): Page<Project> {
        val projects = projectRepository.findByManagerId(userId, minOf(limit, 100), offset)
        val totalCount = projectRepository.countByManagerId(userId)
        return Page(
            items = projects,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun getUserPartnerProjects(userId: String, limit: Int, offset: Int): Page<Project> {
        val projects = projectRepository.findByPartnerId(userId, minOf(limit, 100), offset)
        val totalCount = projectRepository.countByPartnerId(userId)
        return Page(
            items = projects,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }

    override fun createUser(dto: UserInputContract): User {
        val user = User(
            id = UUID.randomUUID().toString(),
            username = dto.username,
            email = dto.email,
            passwordHash = hashPassword(dto.password),
            role = dto.role,
            organizationId = dto.organizationId
        )
        return userRepository.save(user)
    }

    override fun login(username: String, password: String): User? {
        val user = userRepository.findByUsername(username).getOrNull()
        return if (user != null && user.passwordHash == hashPassword(password)) user else null
    }

    private fun hashPassword(password: String): String =
        MessageDigest.getInstance("SHA-256")
            .digest(password.toByteArray())
            .joinToString("") { "%02x".format(it) }
}