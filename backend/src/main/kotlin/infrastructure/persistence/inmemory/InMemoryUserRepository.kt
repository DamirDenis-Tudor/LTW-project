package infrastructure.persistence.inmemory

import domain.model.User
import domain.repository.UserRepository
import org.slf4j.LoggerFactory

class InMemoryUserRepository : UserRepository {
    private val log = LoggerFactory.getLogger(javaClass)
    private val users = mutableListOf<User>()

    override fun findAll(limit: Int, offset: Int): List<User> {
        log.info("findAll(limit=$limit, offset=$offset) -> ${users.size} total")
        return users.drop(offset).take(minOf(limit, 100))
    }

    override fun count(): Int = users.size

    override fun findById(id: String): Result<User> {
        log.info("findById(id=$id)")
        return users.find { it.id == id }?.let { Result.success(it) }
            ?: Result.failure(NoSuchElementException("User not found"))
    }

    override fun findByUsername(username: String): Result<User> {
        log.info("findByUsername(username=$username)")
        return users.find { it.username == username }?.let { Result.success(it) }
            ?: Result.failure(NoSuchElementException("User not found"))
    }

    override fun findByOrganizationId(organizationId: String, limit: Int, offset: Int): List<User> =
        users.filter { it.organizationId == organizationId }.drop(offset).take(minOf(limit, 100))

    override fun countByOrganizationId(organizationId: String): Int =
        users.count { it.organizationId == organizationId }

    override fun findByIds(ids: List<String>): List<User> =
        users.filter { it.id in ids }

    override fun save(user: User): User {
        log.info("save(id=${user.id}, username=${user.username}, role=${user.role})")
        users.removeIf { it.id == user.id }
        users.add(user)
        return user
    }
}
