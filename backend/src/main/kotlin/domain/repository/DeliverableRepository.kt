package domain.repository

import domain.model.Deliverable

interface DeliverableRepository {
    fun findByWorkPackageId(workPackageId: String, limit: Int, offset: Int): List<Deliverable>
    fun countByWorkPackageId(workPackageId: String): Int
    fun findById(id: String): Deliverable?
    fun save(deliverable: Deliverable): Deliverable
}