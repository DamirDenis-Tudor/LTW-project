package infrastructure.persistence.dynamodb

import domain.model.Deliverable
import domain.repository.DeliverableRepository
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.*

class DynamoDeliverableRepository(private val client: DynamoDbClient) : DeliverableRepository {
    private val table = "LTW_Deliverables"

    override fun findByWorkPackageId(workPackageId: String, status: Boolean?, limit: Int, offset: Int): List<Deliverable> =
        scanAll()
            .filter { it.workPackageId == workPackageId }
            .let { list -> status?.let { s -> list.filter { it.isSubmitted == s } } ?: list }
            .drop(offset).take(limit)

    override fun countByWorkPackageId(workPackageId: String, status: Boolean?): Int =
        scanAll()
            .filter { it.workPackageId == workPackageId }
            .let { list -> status?.let { s -> list.filter { it.isSubmitted == s } } ?: list }
            .size

    override fun findById(id: String): Deliverable? =
        client.getItem(GetItemRequest.builder().tableName(table)
            .key(mapOf("id" to AttributeValue.builder().s(id).build())).build())
            .item()?.takeIf { it.isNotEmpty() }?.toDeliverable()

    override fun save(deliverable: Deliverable): Deliverable {
        val item = mutableMapOf(
            "id" to AttributeValue.builder().s(deliverable.id).build(),
            "workPackageId" to AttributeValue.builder().s(deliverable.workPackageId).build(),
            "description" to AttributeValue.builder().s(deliverable.description).build(),
            "dueDate" to AttributeValue.builder().s(deliverable.dueDate).build(),
            "isSubmitted" to AttributeValue.builder().bool(deliverable.isSubmitted).build(),
        )
        deliverable.assignedTo?.let { item["assignedTo"] = AttributeValue.builder().s(it).build() }
        client.putItem(PutItemRequest.builder().tableName(table).item(item).build())
        return deliverable
    }

    private fun scanAll(): List<Deliverable> =
        client.scan(ScanRequest.builder().tableName(table).build()).items().map { it.toDeliverable() }

    private fun Map<String, AttributeValue>.toDeliverable() = Deliverable(
        id = this["id"]!!.s(),
        workPackageId = this["workPackageId"]!!.s(),
        description = this["description"]!!.s(),
        dueDate = this["dueDate"]!!.s(),
        isSubmitted = this["isSubmitted"]?.bool() ?: false,
        assignedTo = this["assignedTo"]?.s()
    )
}
