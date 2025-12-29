package infrastructure.graphql.query

import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.OrganizationUseCase
import infrastructure.graphql.context.requireUser
import infrastructure.graphql.response.OrganizationResponse

class OrganizationQuery : Query {

    private val organizationUseCase = GlobalContext.get().get<OrganizationUseCase>()

    fun organizations(
        dataFetchingEnvironment: DataFetchingEnvironment,
        limit: Int = 10,
        offset: Int = 0
    ): List<OrganizationResponse> = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        organizationUseCase.getOrganizations(limit, offset).map {
            OrganizationResponse(it)
        }
    }
}