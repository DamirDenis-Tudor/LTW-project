package infrastructure.graphql.query

import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.WorkPackageUseCase
import infrastructure.graphql.context.requireUser
import infrastructure.graphql.response.WorkPackageResponse

class WorkPackageQuery : Query {

    private val workPackageUseCase = GlobalContext.get().get<WorkPackageUseCase>()

    fun workPackage(
        dataFetchingEnvironment: DataFetchingEnvironment,
        id: String
    ): WorkPackageResponse? = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        workPackageUseCase.getWorkPackageById(id, user)?.let {
            WorkPackageResponse(it)
        }
    }
}