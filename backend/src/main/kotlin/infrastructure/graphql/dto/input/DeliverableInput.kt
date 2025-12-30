package infrastructure.graphql.dto.input

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.input.DeliverableInputContract

@GraphQLDescription("Input for creating or updating a deliverable")
data class DeliverableInput(
    @GraphQLDescription("Description of the deliverable")
    override val description: String,
    @GraphQLDescription("Due date for the deliverable")
    override val dueDate: String,
    @GraphQLDescription("ID of the user assigned to this deliverable")
    override val assignedTo: String? = null
) : DeliverableInputContract