package application.input

import domain.model.ProjectStatus

data class ProjectInput(
    val title: String,
    val acronym: String,
    val status: ProjectStatus
)