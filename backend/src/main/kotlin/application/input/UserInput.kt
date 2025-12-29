package application.input

import domain.model.UserRole

data class UserInput(
    val username: String,
    val email: String,
    val password: String,
    val role: UserRole,
    val organizationId: String? = null
)