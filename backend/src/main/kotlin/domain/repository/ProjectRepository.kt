package domain.repository

import domain.model.Project

interface ProjectRepository {
    fun findAll(limit: Int, offset: Int): List<Project>
    fun count(): Int
    fun findById(id: String): Project?
    fun findByManagerId(managerId: String, limit: Int, offset: Int): List<Project>
    fun findByPartnerId(partnerId: String, limit: Int, offset: Int): List<Project>
    fun countByManagerId(managerId: String): Int
    fun countByPartnerId(partnerId: String): Int
    fun findPartnersByProjectId(projectId: String, limit: Int, offset: Int): List<String>
    fun findManagersByProjectId(projectId: String, limit: Int, offset: Int): List<String>
    fun countPartnersByProjectId(projectId: String): Int
    fun countManagersByProjectId(projectId: String): Int
    fun isUserManagerOfWorkPackage(userId: String, workPackageId: String): Boolean
    fun save(project: Project): Project
    fun addWorkPackageToProject(projectId: String, workPackageId: String): Project?
    fun removeWorkPackageFromProject(projectId: String, workPackageId: String): Project?
    fun addPartnerToProject(projectId: String, partnerId: String): Project?
    fun removePartnerFromProject(projectId: String, partnerId: String): Project?
    fun addManagerToProject(projectId: String, managerId: String): Project?
    fun removeManagerFromProject(projectId: String, managerId: String): Project?
    fun delete(id: String)
}