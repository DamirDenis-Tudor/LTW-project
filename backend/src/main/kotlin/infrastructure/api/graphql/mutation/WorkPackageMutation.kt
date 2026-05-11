package infrastructure.api.graphql.mutation

import application.usecase.interfaces.WorkPackageUseCase
import com.expediagroup.graphql.server.operations.Mutation
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import domain.model.UserRole
import graphql.schema.DataFetchingEnvironment
import infrastructure.api.graphql.context.validateRoles
import infrastructure.api.graphql.dto.input.WorkPackageInput
import infrastructure.api.graphql.dto.response.WorkPackageResponse
import org.koin.core.context.GlobalContext

class WorkPackageMutation : Mutation {

    private val workPackageUseCase = GlobalContext.get().get<WorkPackageUseCase>()

    @GraphQLDescription("Create a new work package (Admin and Manager only)")
    fun createWorkPackage(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Work package input data") input: WorkPackageInput
    ): WorkPackageResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val workPackage = workPackageUseCase.createWorkPackage(input, user)
        WorkPackageResponse(workPackage)
    }

    @GraphQLDescription("Delete a work package (Admin only)")
    fun removeWorkPackage(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the work package to delete") id: String
    ): Boolean = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) {
        workPackageUseCase.deleteWorkPackage(id)
    }
}