package infrastructure.graphql.mutation

import application.usecase.interfaces.ProjectUseCase
import com.expediagroup.graphql.server.operations.Mutation
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import domain.model.UserRole
import graphql.schema.DataFetchingEnvironment
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.dto.input.ProjectInput
import infrastructure.graphql.dto.response.ProjectResponse
import org.koin.core.context.GlobalContext

class ProjectMutation : Mutation {

    private val projectUseCase = GlobalContext.get().get<ProjectUseCase>()

    @GraphQLDescription("Create a new project (Admin and Manager only)")
    fun createProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Project input data") input: ProjectInput
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val project = projectUseCase.createProject(input, user)
        ProjectResponse(project)
    }

    @GraphQLDescription("Delete a project (Admin only)")
    fun removeProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the project to delete") id: String
    ): Boolean = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) {
        projectUseCase.deleteProject(id)
    }

    @GraphQLDescription("Update an existing project (Admin and Manager only)")
    fun updateProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the project to update") id: String,
        @GraphQLDescription("Updated project data") input: ProjectInput
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val project = projectUseCase.updateProject(id, input)
        ProjectResponse(project)
    }

    @GraphQLDescription("Assign a partner to a project (Admin and Manager only)")
    fun assignPartnerToProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the project") projectId: String,
        @GraphQLDescription("ID of the partner to assign") partnerId: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val project = projectUseCase.addPartnerToProject(projectId, partnerId, user)
        ProjectResponse(project)
    }

    @GraphQLDescription("Assign a work package to a project (Admin and Manager only)")
    fun assignWorkPackageToProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the project") projectId: String,
        @GraphQLDescription("ID of the work package to assign") workPackageId: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val project = projectUseCase.addWorkPackageToProject(projectId, workPackageId, user)
        ProjectResponse(project)
    }

    @GraphQLDescription("Assign a manager to a project (Admin only)")
    fun assignManagerToProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the project") projectId: String,
        @GraphQLDescription("ID of the manager to assign") managerId: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) { user ->
        val project = projectUseCase.addManagerToProject(projectId, managerId, user)
        ProjectResponse(project)
    }

    @GraphQLDescription("Remove a partner from a project (Admin and Manager only)")
    fun removePartnerFromProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the project") projectId: String,
        @GraphQLDescription("ID of the partner to remove") partnerId: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN, UserRole.MANAGER)
    ) { user ->
        val project = projectUseCase.removePartnerFromProject(projectId, partnerId, user)
        ProjectResponse(project)
    }

    @GraphQLDescription("Remove a manager from a project (Admin only)")
    fun removeManagerFromProject(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("ID of the project") projectId: String,
        @GraphQLDescription("ID of the manager to remove") managerId: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) { user ->
        val project = projectUseCase.removeManagerFromProject(projectId, managerId, user)
        ProjectResponse(project)
    }
}