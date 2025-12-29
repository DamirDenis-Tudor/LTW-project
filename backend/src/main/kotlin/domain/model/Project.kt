package domain.model

import domain.model.contracts.ProjectContract

data class Project(
    override val id: String,
    override val title: String,
    override val acronym: String,
    override val status: ProjectStatus,
    val partnerIds: List<String> = emptyList(),
    val workPackageIds: List<String> = emptyList(),
    val managerIds: List<String> = emptyList()
) : ProjectContract

enum class ProjectStatus {
    DRAFT,
    ACTIVE,
    COMPLETED,
    ARCHIVED
}