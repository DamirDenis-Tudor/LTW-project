package infrastructure.auth.local

import application.usecase.interfaces.AuthProvider
import application.usecase.interfaces.JwtUseCase
import domain.model.UserRole
import domain.repository.UserRepository
import java.security.MessageDigest

class LocalAuthProvider(
    private val userRepository: UserRepository,
    private val jwtUseCase: JwtUseCase
) : AuthProvider {

    override fun authenticate(username: String, password: String): String? {
        val user = userRepository.findByUsername(username).getOrNull() ?: return null
        if (user.passwordHash != hashPassword(password)) return null
        return jwtUseCase.generateToken(user)
    }

    override fun createUser(username: String, email: String, password: String, role: UserRole): String = java.util.UUID.randomUUID().toString()
    override fun deleteUser(username: String) {}

    private fun hashPassword(password: String): String =
        MessageDigest.getInstance("SHA-256")
            .digest(password.toByteArray())
            .joinToString("") { "%02x".format(it) }
}
