package application.input

import domain.model.UserRole

interface UserInputContract {
    val username: String
    val email: String
    val password: String
    val role: UserRole
    val organizationId: String?
}