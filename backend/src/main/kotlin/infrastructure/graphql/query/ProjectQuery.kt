package infrastructure.graphql.query

import application.exception.NotFoundException
import com.expediagroup.graphql.server.operations.Query
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.ProjectUseCase
import infrastructure.graphql.context.requireUser
import infrastructure.graphql.dto.page.PaginatedProjects
import infrastructure.graphql.dto.response.ProjectResponse

class ProjectQuery : Query {

    private val projectUseCase = GlobalContext.get().get<ProjectUseCase>()

    @GraphQLDescription("Get paginated list of projects based on user role and permissions")
    fun projects(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Maximum number of projects to return") limit: Int = 10,
        @GraphQLDescription("Number of projects to skip for pagination") offset: Int = 0
    ): PaginatedProjects = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        val page = projectUseCase.getAllProjects(limit, offset, user)
        PaginatedProjects(
            items = page.items.map { ProjectResponse(it) },
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }

    @GraphQLDescription("Get a specific project by ID if user has access")
    fun project(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Unique identifier of the project") id: String
    ): ProjectResponse = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        projectUseCase.getProjectById(id, user)?.let { 
            ProjectResponse(it) 
        } ?: throw NotFoundException("Project not found")
    }
}