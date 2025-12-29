package domain.model.contracts

import domain.model.ProjectStatus

interface ProjectContract {
    val id: String
    val title: String
    val acronym: String
    val status: ProjectStatus
}