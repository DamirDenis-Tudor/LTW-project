package domain.repository

import domain.model.Project

interface ProjectRepository {
    fun findAll(limit: Int, offset: Int): List<Project>
    fun findById(id: String): Project?
    fun findByManagerId(managerId: String, limit: Int, offset: Int): List<Project>
    fun findByPartnerId(partnerId: String, limit: Int, offset: Int): List<Project>
    fun countByManagerId(managerId: String): Int
    fun countByPartnerId(partnerId: String): Int
    fun findPartnersByProjectId(projectId: String, limit: Int, offset: Int): List<String>
    fun findManagersByProjectId(projectId: String, limit: Int, offset: Int): List<String>
    fun countPartnersByProjectId(projectId: String): Int
    fun countManagersByProjectId(projectId: String): Int
    fun save(project: Project): Project
    fun delete(id: String)
}