package infrastructure.graphql.mutation

import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.input.WorkPackageInput
import application.usecase.interfaces.WorkPackageUseCase
import domain.model.UserRole
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.response.WorkPackageResponse

class WorkPackageMutation : Mutation {

    private val workPackageUseCase = GlobalContext.get().get<WorkPackageUseCase>()

    fun createWorkPackage(
        dataFetchingEnvironment: DataFetchingEnvironment,
        input: WorkPackageInput
    ): WorkPackageResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val workPackage = workPackageUseCase.createWorkPackage(input, user)
        WorkPackageResponse(workPackage)
    }

    fun removeWorkPackage(
        dataFetchingEnvironment: DataFetchingEnvironment,
        id: String
    ): Boolean = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) {
        workPackageUseCase.deleteWorkPackage(id)
    }
}