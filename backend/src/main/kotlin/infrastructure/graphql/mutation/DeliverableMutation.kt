package infrastructure.graphql.mutation

import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.input.DeliverableInput
import application.usecase.interfaces.DeliverableUseCase
import domain.model.UserRole
import infrastructure.graphql.context.requireUser
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.response.DeliverableResponse

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