package infrastructure.graphql.mutation

import application.usecase.interfaces.DeliverableUseCase
import com.expediagroup.graphql.server.operations.Mutation
import domain.model.UserRole
import graphql.schema.DataFetchingEnvironment
import infrastructure.graphql.context.requireUser
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.dto.input.DeliverableInput
import infrastructure.graphql.dto.response.DeliverableResponse
import org.koin.core.context.GlobalContext

class DeliverableMutation : Mutation {

    private val deliverableUseCase = GlobalContext.get().get<DeliverableUseCase>()

    fun createDeliverable(
        dataFetchingEnvironment: DataFetchingEnvironment,
        wpId: String,
        input: DeliverableInput
    ): DeliverableResponse =
        dataFetchingEnvironment.graphQlContext.validateRoles(
            allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
        ) {
            val deliverable = deliverableUseCase.createDeliverable(wpId, input)
            DeliverableResponse(deliverable)
        }

    fun submitDeliverable(
        dataFetchingEnvironment: DataFetchingEnvironment,
        id: String,
        status: Boolean
    ): DeliverableResponse =
        dataFetchingEnvironment.graphQlContext.requireUser { user ->
            val deliverable = deliverableUseCase.updateDeliverableStatus(id, status, user)
            DeliverableResponse(deliverable)
        }
}