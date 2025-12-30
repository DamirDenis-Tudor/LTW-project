package infrastructure.graphql.query

import com.expediagroup.graphql.server.operations.Query
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.usecase.interfaces.OrganizationUseCase
import infrastructure.graphql.context.requireUser
import infrastructure.graphql.dto.page.PaginatedOrganizations
import infrastructure.graphql.dto.response.OrganizationResponse

class OrganizationQuery : Query {

    private val organizationUseCase = GlobalContext.get().get<OrganizationUseCase>()

    fun organizations(
        dataFetchingEnvironment: DataFetchingEnvironment,
        limit: Int = 10,
        offset: Int = 0
    ): PaginatedOrganizations = dataFetchingEnvironment.graphQlContext.requireUser { user ->
        val page = organizationUseCase.getOrganizations(limit, offset)
        PaginatedOrganizations(
            items = page.items.map { OrganizationResponse(it) },
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }
}