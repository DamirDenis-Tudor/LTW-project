package domain.model

import domain.model.contracts.UserContract

data class User(
    override val id: String,
    override val username: String,
    override val email: String,
    val passwordHash: String,
    override val role: UserRole,
    override val organizationId: String? = null
) : UserContract

enum class UserRole {
    ADMIN,
    MANAGER,
    PARTNER
}