package infrastructure.graphql.dto.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.common.Page
import infrastructure.graphql.dto.response.OrganizationResponse

@GraphQLDescription("Paginated list of organizations")
data class PaginatedOrganizations(
    @GraphQLDescription("List of organizations in current page")
    override val items: List<OrganizationResponse>,
    @GraphQLDescription("Total number of organizations available")
    override val totalCount: Int,
    @GraphQLDescription("Whether there are more organizations available")
    override val hasNextPage: Boolean
) : Page<OrganizationResponse>(items, totalCount, hasNextPage)