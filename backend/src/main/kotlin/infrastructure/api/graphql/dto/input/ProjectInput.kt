package infrastructure.api.graphql.dto.input

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.input.ProjectInputContract
import domain.model.ProjectStatus

@GraphQLDescription("Input for creating or updating a project")
data class ProjectInput(
    @GraphQLDescription("Title of the project")
    override val title: String,
    @GraphQLDescription("Acronym of the project")
    override val acronym: String,
    @GraphQLDescription("Status of the project")
    override val status: ProjectStatus
) : ProjectInputContract