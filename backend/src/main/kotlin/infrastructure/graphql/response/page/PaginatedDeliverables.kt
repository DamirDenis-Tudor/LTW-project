package infrastructure.graphql.response.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import infrastructure.graphql.response.DeliverableResponse

@GraphQLDescription("Paginated deliverables response")
data class PaginatedDeliverables(
    @GraphQLDescription("List of deliverables in current page")
    val items: List<DeliverableResponse>,
    @GraphQLDescription("Total number of deliverables available")
    val totalCount: Int,
    @GraphQLDescription("Whether there are more deliverables available")
    val hasNextPage: Boolean
)