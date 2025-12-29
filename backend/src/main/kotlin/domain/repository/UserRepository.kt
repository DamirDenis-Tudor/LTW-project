package domain.repository

import domain.model.User

interface UserRepository {
    fun findAll(limit: Int, offset: Int): List<User>
    fun count(): Int
    fun findById(id: String): Result<User>
    fun findByUsername(username: String): Result<User>
    fun findByOrganizationId(organizationId: String, limit: Int, offset: Int): List<User>
    fun countByOrganizationId(organizationId: String): Int
    fun findByIds(ids: List<String>): List<User>
    fun save(user: User): User
}