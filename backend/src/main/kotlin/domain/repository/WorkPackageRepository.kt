package domain.repository

import domain.model.WorkPackage

interface WorkPackageRepository {
    fun findByProjectId(projectId: String, limit: Int, offset: Int): List<WorkPackage>
    fun countByProjectId(projectId: String): Int
    fun findById(id: String): WorkPackage?
    fun save(workPackage: WorkPackage): WorkPackage
    fun delete(id: String)
}