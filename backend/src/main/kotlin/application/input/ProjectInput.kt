package application.input

import domain.model.ProjectStatus

interface ProjectInputContract {
    val title: String
    val acronym: String
    val status: ProjectStatus
}