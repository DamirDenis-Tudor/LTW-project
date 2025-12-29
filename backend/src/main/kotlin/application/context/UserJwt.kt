package application.context

import domain.model.UserRole

data class UserJwt(
    val id: String,
    val username: String,
    val role: UserRole,
    val organizationId: String? = null
)