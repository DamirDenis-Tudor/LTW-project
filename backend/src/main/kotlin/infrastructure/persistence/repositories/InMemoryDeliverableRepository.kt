package infrastructure.persistence.repositories

import domain.model.Deliverable
import domain.repository.DeliverableRepository

class InMemoryDeliverableRepository : DeliverableRepository {
    private val deliverables = mutableListOf<Deliverable>()

    override fun findByWorkPackageId(workPackageId: String, limit: Int, offset: Int): List<Deliverable> =
        deliverables.filter { it.workPackageId == workPackageId }
            .drop(offset)
            .take(minOf(limit, 100))

    override fun findByWorkPackageIdAndStatus(workPackageId: String, status: Boolean, limit: Int, offset: Int): List<Deliverable> =
        deliverables.filter { it.workPackageId == workPackageId && it.isSubmitted == status }
            .drop(offset)
            .take(minOf(limit, 100))

    override fun countByWorkPackageId(workPackageId: String): Int =
        deliverables.count { it.workPackageId == workPackageId }

    override fun countByWorkPackageIdAndStatus(workPackageId: String, status: Boolean): Int =
        deliverables.count { it.workPackageId == workPackageId && it.isSubmitted == status }

    override fun findById(id: String): Deliverable? = deliverables.find { it.id == id }

    override fun save(deliverable: Deliverable): Deliverable {
        deliverables.removeIf { it.id == deliverable.id }
        deliverables.add(deliverable)
        return deliverable
    }
}