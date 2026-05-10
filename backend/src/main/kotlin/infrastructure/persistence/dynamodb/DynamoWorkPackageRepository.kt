package infrastructure.persistence.dynamodb

import domain.model.WorkPackage
import domain.repository.WorkPackageRepository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.*

class DynamoWorkPackageRepository(private val client: DynamoDbClient) : WorkPackageRepository {
    private val table = "LTW_WorkPackages"

    override fun findByProjectId(projectId: String, limit: Int, offset: Int): List<WorkPackage> =
        scanAll().filter { it.projectId == projectId }.drop(offset).take(limit)

    override fun countByProjectId(projectId: String): Int =
        scanAll().count { it.projectId == projectId }

    override fun findById(id: String): WorkPackage? =
        client.getItem(GetItemRequest.builder().tableName(table)
            .key(mapOf("id" to AttributeValue.builder().s(id).build())).build())
            .item()?.takeIf { it.isNotEmpty() }?.toWorkPackage()

    override fun save(workPackage: WorkPackage): WorkPackage {
        client.putItem(PutItemRequest.builder().tableName(table).item(mapOf(
            "id" to AttributeValue.builder().s(workPackage.id).build(),
            "projectId" to AttributeValue.builder().s(workPackage.projectId).build(),
            "wpNumber" to AttributeValue.builder().n(workPackage.wpNumber.toString()).build(),
            "title" to AttributeValue.builder().s(workPackage.title).build(),
            "leadPartnerId" to AttributeValue.builder().s(workPackage.leadPartnerId).build(),
        )).build())
        return workPackage
    }

    override fun delete(id: String) {
        client.deleteItem(DeleteItemRequest.builder().tableName(table)
            .key(mapOf("id" to AttributeValue.builder().s(id).build())).build())
    }

    private fun scanAll(): List<WorkPackage> =
        client.scan(ScanRequest.builder().tableName(table).build()).items().map { it.toWorkPackage() }

    private fun Map<String, AttributeValue>.toWorkPackage() = WorkPackage(
        id = this["id"]!!.s(),
        projectId = this["projectId"]!!.s(),
        wpNumber = this["wpNumber"]!!.n().toInt(),
        title = this["title"]!!.s(),
        leadPartnerId = this["leadPartnerId"]!!.s()
    )
}
