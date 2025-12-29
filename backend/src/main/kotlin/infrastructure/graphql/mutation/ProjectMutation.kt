package infrastructure.graphql.mutation

import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.input.ProjectInput
import application.usecase.interfaces.ProjectUseCase
import domain.model.UserRole
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.response.ProjectResponse

class ProjectMutation : Mutation {

    private val projectUseCase = GlobalContext.get().get<ProjectUseCase>()

    fun createProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        input: ProjectInput
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val project = projectUseCase.createProject(input, user)
        ProjectResponse(project)
    }

    fun removeProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        id: String
    ): Boolean = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) {
        projectUseCase.deleteProject(id)
    }

    fun assignPartnerToProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        projectId: String,
        partnerId: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val project = projectUseCase.addPartnerToProject(projectId, partnerId, user)
        ProjectResponse(project)
    }

    fun assignWorkPackageToProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        projectId: String,
        workPackageId: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val project = projectUseCase.addWorkPackageToProject(projectId, workPackageId, user)
        ProjectResponse(project)
    }

    fun assignManagerToProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        projectId: String,
        managerId: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) { user ->
        val project = projectUseCase.addManagerToProject(projectId, managerId, user)
        ProjectResponse(project)
    }
}