package infrastructure.persistence.inmemory

import domain.model.Deliverable
import domain.repository.DeliverableRepository
import org.slf4j.LoggerFactory

class InMemoryDeliverableRepository : DeliverableRepository {
    private val log = LoggerFactory.getLogger(javaClass)
    private val deliverables = mutableListOf<Deliverable>()

    override fun findByWorkPackageId(workPackageId: String, status: Boolean?, limit: Int, offset: Int): List<Deliverable> =
        deliverables.filter { it.workPackageId == workPackageId && (status == null || it.isSubmitted == status) }
            .drop(offset).take(minOf(limit, 100))

    override fun countByWorkPackageId(workPackageId: String, status: Boolean?): Int =
        deliverables.count { it.workPackageId == workPackageId && (status == null || it.isSubmitted == status) }

    override fun findById(id: String): Deliverable? {
        log.info("findById(id=$id)")
        return deliverables.find { it.id == id }
    }

    override fun save(deliverable: Deliverable): Deliverable {
        log.info("save(id=${deliverable.id}, desc=${deliverable.description})")
        deliverables.removeIf { it.id == deliverable.id }
        deliverables.add(deliverable)
        return deliverable
    }
}
