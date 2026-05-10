package infrastructure.auth

import application.usecase.interfaces.AuthProvider
import domain.model.UserRole

object NoOpAuthProvider : AuthProvider {
    override fun createUser(username: String, email: String, password: String, role: UserRole) {}
    override fun deleteUser(username: String) {}
}
