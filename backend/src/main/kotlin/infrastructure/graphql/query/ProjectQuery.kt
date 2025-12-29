package infrastructure.graphql.query

import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.ProjectUseCase
import infrastructure.graphql.context.requireUser
import infrastructure.graphql.response.ProjectResponse

class ProjectQuery : Query {

    private val projectUseCase = GlobalContext.get().get<ProjectUseCase>()

    fun projects(
        dataFetchingEnvironment: DataFetchingEnvironment,
        limit: Int = 10,
        offset: Int = 0
    ): List<ProjectResponse> = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        projectUseCase.getAllProjects(limit, offset, user).map { 
            ProjectResponse(it) 
        }
    }

    fun project(
        dataFetchingEnvironment: DataFetchingEnvironment,
        id: String
    ): ProjectResponse? = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        projectUseCase.getProjectById(id, user)?.let { 
            ProjectResponse(it) 
        }
    }
}