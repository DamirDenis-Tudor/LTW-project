package application.usecase.implementation

import application.input.UserInput
import application.usecase.interfaces.UserUseCase
import domain.model.User
import domain.repository.UserRepository
import java.security.MessageDigest
import java.util.*

class UserUseCaseImpl(private val userRepository: UserRepository) : UserUseCase {
    
    override fun getAllUsers(limit: Int, offset: Int): List<User> =
        userRepository.findAll(minOf(limit, 100), offset)

    override fun getTotalUsersCount(): Int = userRepository.count()

    override fun getUserById(id: String): User? = userRepository.findById(id).getOrNull()

    override fun createUser(dto: UserInput): User {
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