package infrastructure.persistence.inmemory

import domain.model.User
import domain.repository.UserRepository

class InMemoryUserRepository : UserRepository {
    private val users = mutableListOf<User>()

    override fun findAll(limit: Int, offset: Int): List<User> =
        users.drop(offset).take(minOf(limit, 100))

    override fun count(): Int = users.size

    override fun findById(id: String): Result<User> =
        users.find { it.id == id }?.let { Result.success(it) }
            ?: Result.failure(NoSuchElementException("User not found"))

    override fun findByUsername(username: String): Result<User> =
        users.find { it.username == username }?.let { Result.success(it) }
            ?: Result.failure(NoSuchElementException("User not found"))

    override fun findByOrganizationId(organizationId: String, limit: Int, offset: Int): List<User> =
        users.filter { it.organizationId == organizationId }
            .drop(offset)
            .take(minOf(limit, 100))

    override fun countByOrganizationId(organizationId: String): Int =
        users.count { it.organizationId == organizationId }

    override fun findByIds(ids: List<String>): List<User> =
        users.filter { it.id in ids }

    override fun save(user: User): User {
        users.removeIf { it.id == user.id }
        users.add(user)
        return user
    }
}