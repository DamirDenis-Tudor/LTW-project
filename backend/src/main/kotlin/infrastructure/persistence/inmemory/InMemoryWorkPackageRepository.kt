package infrastructure.persistence.inmemory

import domain.model.WorkPackage
import domain.repository.WorkPackageRepository
import org.slf4j.LoggerFactory

class InMemoryWorkPackageRepository : WorkPackageRepository {
    private val log = LoggerFactory.getLogger(javaClass)
    private val workPackages = mutableListOf<WorkPackage>()

    override fun findByProjectId(projectId: String, limit: Int, offset: Int): List<WorkPackage> =
        workPackages.filter { it.projectId == projectId }.drop(offset).take(minOf(limit, 100))

    override fun countByProjectId(projectId: String): Int =
        workPackages.count { it.projectId == projectId }

    override fun findById(id: String): WorkPackage? {
        log.info("findById(id=$id)")
        return workPackages.find { it.id == id }
    }

    override fun save(workPackage: WorkPackage): WorkPackage {
        log.info("save(id=${workPackage.id}, title=${workPackage.title})")
        workPackages.removeIf { it.id == workPackage.id }
        workPackages.add(workPackage)
        return workPackage
    }

    override fun delete(id: String) {
        log.info("delete(id=$id)")
        workPackages.removeIf { it.id == id }
    }
}
