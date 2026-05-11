package infrastructure.api.graphql.dto.input

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.input.WorkPackageInputContract

@GraphQLDescription("Input for creating or updating a work package")
data class WorkPackageInput(
    @GraphQLDescription("ID of the project this work package belongs to")
    override val projectId: String,
    @GraphQLDescription("Work package number")
    override val wpNumber: Int,
    @GraphQLDescription("Title of the work package")
    override val title: String,
    @GraphQLDescription("ID of the lead partner for this work package")
    override val leadPartnerId: String
) : WorkPackageInputContract