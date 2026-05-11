package infrastructure.persistence.dynamodb

import domain.model.User
import domain.model.UserRole
import domain.repository.UserRepository
import org.slf4j.LoggerFactory
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.*

class DynamoUserRepository(private val client: DynamoDbClient) : UserRepository {
    private val log = LoggerFactory.getLogger(javaClass)
    private val table = "LTW_Users"

    override fun findAll(limit: Int, offset: Int): List<User> {
        log.info("findAll(limit=$limit, offset=$offset)")
        return client.scan(ScanRequest.builder().tableName(table).build())
            .items().map { it.toUser() }.drop(offset).take(limit)
    }

    override fun count(): Int =
        client.scan(ScanRequest.builder().tableName(table).select(Select.COUNT).build()).count()

    override fun findById(id: String): Result<User> {
        log.info("findById(id=$id)")
        return client.getItem(GetItemRequest.builder().tableName(table)
            .key(mapOf("id" to AttributeValue.builder().s(id).build())).build())
            .item()?.takeIf { it.isNotEmpty() }?.toUser()?.let { Result.success(it) }
            ?: Result.failure(NoSuchElementException("User not found"))
    }

    override fun findByUsername(username: String): Result<User> {
        log.info("findByUsername(username=$username)")
        return findAll(Int.MAX_VALUE, 0).find { it.username == username }?.let { Result.success(it) }
            ?: Result.failure(NoSuchElementException("User not found"))
    }

    override fun findByOrganizationId(organizationId: String, limit: Int, offset: Int): List<User> =
        findAll(Int.MAX_VALUE, 0).filter { it.organizationId == organizationId }.drop(offset).take(limit)

    override fun countByOrganizationId(organizationId: String): Int =
        findAll(Int.MAX_VALUE, 0).count { it.organizationId == organizationId }

    override fun findByIds(ids: List<String>): List<User> =
        ids.mapNotNull { findById(it).getOrNull() }

    override fun save(user: User): User {
        log.info("save(id=${user.id}, username=${user.username}, role=${user.role})")
        val item = mutableMapOf(
            "id" to AttributeValue.builder().s(user.id).build(),
            "username" to AttributeValue.builder().s(user.username).build(),
            "email" to AttributeValue.builder().s(user.email).build(),
            "passwordHash" to AttributeValue.builder().s(user.passwordHash).build(),
            "role" to AttributeValue.builder().s(user.role.name).build(),
        )
        user.organizationId?.let { item["organizationId"] = AttributeValue.builder().s(it).build() }
        client.putItem(PutItemRequest.builder().tableName(table).item(item).build())
        return user
    }

    private fun Map<String, AttributeValue>.toUser() = User(
        id = this["id"]!!.s(),
        username = this["username"]!!.s(),
        email = this["email"]!!.s(),
        passwordHash = this["passwordHash"]?.s() ?: "",
        role = UserRole.valueOf(this["role"]!!.s()),
        organizationId = this["organizationId"]?.s()
    )
}
