package infrastructure.api.graphql.mutation

import application.usecase.interfaces.DeliverableUseCase
import com.expediagroup.graphql.server.operations.Mutation
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import domain.model.UserRole
import graphql.schema.DataFetchingEnvironment
import infrastructure.api.graphql.context.requireUser
import infrastructure.api.graphql.context.validateRoles
import infrastructure.api.graphql.dto.input.DeliverableInput
import infrastructure.api.graphql.dto.response.DeliverableResponse
import org.koin.core.context.GlobalContext

class DeliverableMutation : Mutation {

    private val deliverableUseCase = GlobalContext.get().get<DeliverableUseCase>()

    @GraphQLDescription("Create a new deliverable for a work package (Admin and Manager only)")
    fun createDeliverable(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the work package") wpId: String,
        @GraphQLDescription("Deliverable input data") input: DeliverableInput
    ): DeliverableResponse =
        dataFetchingEnvironment.graphQlContext.validateRoles(
            allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
        ) {
            val deliverable = deliverableUseCase.createDeliverable(wpId, input)
            DeliverableResponse(deliverable)
        }

    @GraphQLDescription("Update deliverable submission status")
    fun submitDeliverable(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the deliverable") id: String,
        @GraphQLDescription("Submission status (true for submitted, false for not submitted)") status: Boolean
    ): DeliverableResponse =
        dataFetchingEnvironment.graphQlContext.requireUser { user ->
            val deliverable = deliverableUseCase.updateDeliverableStatus(id, status, user)
            DeliverableResponse(deliverable)
        }
}