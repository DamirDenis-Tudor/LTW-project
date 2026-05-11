package application.usecase.implementation

import application.common.Page
import application.input.UserInputContract
import application.usecase.interfaces.UserUseCase
import application.usecase.interfaces.JwtUseCase
import application.exception.NotFoundException
import application.usecase.interfaces.AuthProvider
import domain.model.User
import domain.model.Organization
import domain.model.Project
import domain.repository.UserRepository
import domain.repository.OrganizationRepository
import domain.repository.ProjectRepository
import org.koin.core.context.GlobalContext
import org.slf4j.LoggerFactory
import java.security.MessageDigest
import java.util.*

class UserUseCaseImpl(
    private val userRepository: UserRepository,
    private val organizationRepository: OrganizationRepository,
    private val projectRepository: ProjectRepository,
    private val authProvider: AuthProvider
) : UserUseCase {
    private val log = LoggerFactory.getLogger(javaClass)
    
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
        log.info("createUser(username=${dto.username}, role=${dto.role}, orgId=${dto.organizationId})")
        dto.organizationId?.let { orgId ->
            organizationRepository.findById(orgId) ?: throw NotFoundException("Organization not found")
        }

        val cognitoSub = authProvider.createUser(dto.username, dto.email, dto.password, dto.role)

        val user = User(
            id = cognitoSub,
            username = dto.username,
            email = dto.email,
            passwordHash = hashPassword(dto.password),
            role = dto.role,
            organizationId = dto.organizationId
        )
        log.info("Saving user to DB: id=${user.id}")
        return userRepository.save(user)
    }

    override fun login(username: String, password: String): String? {
        val token = authProvider.authenticate(username, password) ?: return null

        // Ensure user exists in DB (handles case where user exists in Cognito but not DB)
        if (userRepository.findByUsername(username).isFailure) {
            val decoded = GlobalContext.get().get<JwtUseCase>().verifyToken(token)
            val user = User(
                id = decoded.id,
                username = decoded.username,
                email = "",
                passwordHash = "",
                role = decoded.role,
                organizationId = decoded.organizationId
            )
            userRepository.save(user)
        }

        return token
    }

    private fun hashPassword(password: String): String =
        MessageDigest.getInstance("SHA-256")
            .digest(password.toByteArray())
            .joinToString("") { "%02x".format(it) }
}