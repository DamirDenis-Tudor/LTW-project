package infrastructure.persistence.dynamodb

import domain.model.Project
import domain.model.ProjectStatus
import domain.repository.ProjectRepository
import org.slf4j.LoggerFactory
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.*

class DynamoProjectRepository(private val client: DynamoDbClient) : ProjectRepository {
    private val log = LoggerFactory.getLogger(javaClass)
    private val table = "LTW_Projects"

    override fun findAll(limit: Int, offset: Int): List<Project> {
        log.info("findAll(limit=$limit, offset=$offset)")
        return scanAll().drop(offset).take(limit)
    }

    override fun count(): Int =
        client.scan(ScanRequest.builder().tableName(table).select(Select.COUNT).build()).count()

    override fun findById(id: String): Project? {
        log.info("findById(id=$id)")
        return client.getItem(GetItemRequest.builder().tableName(table)
            .key(mapOf("id" to AttributeValue.builder().s(id).build())).build())
            .item()?.takeIf { it.isNotEmpty() }?.toProject()
    }

    override fun findByManagerId(managerId: String, limit: Int, offset: Int): List<Project> =
        scanAll().filter { managerId in it.managerIds }.drop(offset).take(limit)

    override fun findByPartnerId(partnerId: String, limit: Int, offset: Int): List<Project> =
        scanAll().filter { partnerId in it.partnerIds }.drop(offset).take(limit)

    override fun countByManagerId(managerId: String): Int =
        scanAll().count { managerId in it.managerIds }

    override fun countByPartnerId(partnerId: String): Int =
        scanAll().count { partnerId in it.partnerIds }

    override fun findPartnersByProjectId(projectId: String, limit: Int, offset: Int): List<String> =
        findById(projectId)?.partnerIds?.drop(offset)?.take(limit) ?: emptyList()

    override fun findManagersByProjectId(projectId: String, limit: Int, offset: Int): List<String> =
        findById(projectId)?.managerIds?.drop(offset)?.take(limit) ?: emptyList()

    override fun countPartnersByProjectId(projectId: String): Int =
        findById(projectId)?.partnerIds?.size ?: 0

    override fun countManagersByProjectId(projectId: String): Int =
        findById(projectId)?.managerIds?.size ?: 0

    override fun isUserManagerOfWorkPackage(userId: String, workPackageId: String): Boolean =
        scanAll().any { userId in it.managerIds && workPackageId in it.workPackageIds }

    override fun save(project: Project): Project {
        log.info("save(id=${project.id}, title=${project.title})")
        val item = mutableMapOf(
            "id" to AttributeValue.builder().s(project.id).build(),
            "title" to AttributeValue.builder().s(project.title).build(),
            "acronym" to AttributeValue.builder().s(project.acronym).build(),
            "status" to AttributeValue.builder().s(project.status.name).build(),
            "partnerIds" to AttributeValue.builder().ss(project.partnerIds.ifEmpty { listOf("__empty__") }).build(),
            "workPackageIds" to AttributeValue.builder().ss(project.workPackageIds.ifEmpty { listOf("__empty__") }).build(),
            "managerIds" to AttributeValue.builder().ss(project.managerIds.ifEmpty { listOf("__empty__") }).build(),
        )
        client.putItem(PutItemRequest.builder().tableName(table).item(item).build())
        return project
    }

    override fun addWorkPackageToProject(projectId: String, workPackageId: String): Project? =
        findById(projectId)?.let { save(it.copy(workPackageIds = it.workPackageIds + workPackageId)) }

    override fun removeWorkPackageFromProject(projectId: String, workPackageId: String): Project? =
        findById(projectId)?.let { save(it.copy(workPackageIds = it.workPackageIds - workPackageId)) }

    override fun addPartnerToProject(projectId: String, partnerId: String): Project? =
        findById(projectId)?.let { if (partnerId in it.partnerIds) it else save(it.copy(partnerIds = it.partnerIds + partnerId)) }

    override fun removePartnerFromProject(projectId: String, partnerId: String): Project? =
        findById(projectId)?.let { save(it.copy(partnerIds = it.partnerIds - partnerId)) }

    override fun addManagerToProject(projectId: String, managerId: String): Project? =
        findById(projectId)?.let { if (managerId in it.managerIds) it else save(it.copy(managerIds = it.managerIds + managerId)) }

    override fun removeManagerFromProject(projectId: String, managerId: String): Project? =
        findById(projectId)?.let { save(it.copy(managerIds = it.managerIds - managerId)) }

    override fun delete(id: String) {
        client.deleteItem(DeleteItemRequest.builder().tableName(table)
            .key(mapOf("id" to AttributeValue.builder().s(id).build())).build())
    }

    private fun scanAll(): List<Project> =
        client.scan(ScanRequest.builder().tableName(table).build()).items().map { it.toProject() }

    private fun Map<String, AttributeValue>.toProject() = Project(
        id = this["id"]!!.s(),
        title = this["title"]!!.s(),
        acronym = this["acronym"]!!.s(),
        status = ProjectStatus.valueOf(this["status"]!!.s()),
        partnerIds = this["partnerIds"]?.ss()?.filter { it != "__empty__" } ?: emptyList(),
        workPackageIds = this["workPackageIds"]?.ss()?.filter { it != "__empty__" } ?: emptyList(),
        managerIds = this["managerIds"]?.ss()?.filter { it != "__empty__" } ?: emptyList(),
    )
}
