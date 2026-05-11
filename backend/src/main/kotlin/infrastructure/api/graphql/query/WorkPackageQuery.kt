package infrastructure.api.graphql.query

import com.expediagroup.graphql.server.operations.Query
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.WorkPackageUseCase
import infrastructure.api.graphql.context.requireUser
import infrastructure.api.graphql.dto.response.WorkPackageResponse

class WorkPackageQuery : Query {

    private val workPackageUseCase = GlobalContext.get().get<WorkPackageUseCase>()

    @GraphQLDescription("Get a specific work package by ID if user has access")
    fun workPackage(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Unique identifier of the work package") id: String
    ): WorkPackageResponse? = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        workPackageUseCase.getWorkPackageById(id, user)?.let {
            WorkPackageResponse(it)
        }
    }
}