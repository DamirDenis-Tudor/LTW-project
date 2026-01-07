package domain.repository

import domain.model.Deliverable

interface DeliverableRepository {
    fun findByWorkPackageId(workPackageId: String, status: Boolean?, limit: Int, offset: Int): List<Deliverable>
    fun countByWorkPackageId(workPackageId: String, status: Boolean?): Int
    fun findById(id: String): Deliverable?
    fun save(deliverable: Deliverable): Deliverable
}