package infrastructure.graphql.mutation

import application.usecase.interfaces.WorkPackageUseCase
import com.expediagroup.graphql.server.operations.Mutation
import domain.model.UserRole
import graphql.schema.DataFetchingEnvironment
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.dto.input.WorkPackageInput
import infrastructure.graphql.dto.response.WorkPackageResponse
import org.koin.core.context.GlobalContext

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