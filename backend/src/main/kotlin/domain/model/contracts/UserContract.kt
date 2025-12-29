package domain.model.contracts

import domain.model.UserRole

interface UserContract {
    val id: String
    val username: String
    val email: String
    val role: UserRole
    val organizationId: String?
}