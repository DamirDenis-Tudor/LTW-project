package infrastructure.persistence.dynamodb

import domain.model.Organization
import domain.repository.OrganizationRepository
import org.slf4j.LoggerFactory
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.*

class DynamoOrganizationRepository(private val client: DynamoDbClient) : OrganizationRepository {
    private val log = LoggerFactory.getLogger(javaClass)
    private val table = "LTW_Organizations"

    override fun findAll(limit: Int, offset: Int): List<Organization> {
        log.info("findAll(limit=$limit, offset=$offset)")
        return client.scan(ScanRequest.builder().tableName(table).build())
            .items().map { it.toOrganization() }.drop(offset).take(limit)
    }

    override fun count(): Int =
        client.scan(ScanRequest.builder().tableName(table).select(Select.COUNT).build()).count()

    override fun findById(id: String): Organization? {
        log.info("findById(id=$id)")
        return client.getItem(GetItemRequest.builder().tableName(table)
            .key(mapOf("id" to AttributeValue.builder().s(id).build())).build())
            .item()?.takeIf { it.isNotEmpty() }?.toOrganization()
    }

    override fun save(organization: Organization): Organization {
        log.info("save(id=${organization.id}, name=${organization.name})")
        client.putItem(PutItemRequest.builder().tableName(table).item(mapOf(
            "id" to AttributeValue.builder().s(organization.id).build(),
            "name" to AttributeValue.builder().s(organization.name).build(),
            "picCode" to AttributeValue.builder().n(organization.picCode.toString()).build(),
            "country" to AttributeValue.builder().s(organization.country).build(),
        )).build())
        return organization
    }

    private fun Map<String, AttributeValue>.toOrganization() = Organization(
        id = this["id"]!!.s(),
        name = this["name"]!!.s(),
        picCode = this["picCode"]!!.n().toInt(),
        country = this["country"]!!.s()
    )
}
