package infrastructure.graphql.dto.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.common.Page
import infrastructure.graphql.dto.response.DeliverableResponse

@GraphQLDescription("Paginated deliverables response")
data class PaginatedDeliverables(
    @GraphQLDescription("List of deliverables in current page")
    override val items: List<DeliverableResponse>,
    @GraphQLDescription("Total number of deliverables available")
    override val totalCount: Int,
    @GraphQLDescription("Whether there are more deliverables available")
    override val hasNextPage: Boolean
) : Page<DeliverableResponse>(items, totalCount, hasNextPage)