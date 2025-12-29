package infrastructure.persistence.repositories

import domain.model.WorkPackage
import domain.repository.WorkPackageRepository

class InMemoryWorkPackageRepository : WorkPackageRepository {
    private val workPackages = mutableListOf<WorkPackage>()

    override fun findByProjectId(projectId: String, limit: Int, offset: Int): List<WorkPackage> =
        workPackages.filter { it.projectId == projectId }
            .drop(offset)
            .take(minOf(limit, 100))

    override fun countByProjectId(projectId: String): Int =
        workPackages.count { it.projectId == projectId }

    override fun findById(id: String): WorkPackage? = workPackages.find { it.id == id }

    override fun save(workPackage: WorkPackage): WorkPackage {
        workPackages.removeIf { it.id == workPackage.id }
        workPackages.add(workPackage)
        return workPackage
    }

    override fun delete(id: String) {
        workPackages.removeIf { it.id == id }
    }
}