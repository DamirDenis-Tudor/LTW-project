package infrastructure.graphql.response.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import infrastructure.graphql.response.UserResponse

@GraphQLDescription("Paginated users response")
data class PaginatedUsers(
    @GraphQLDescription("List of users in current page")
    val items: List<UserResponse>,
    @GraphQLDescription("Total number of users available")
    val totalCount: Int,
    @GraphQLDescription("Whether there are more users available")
    val hasNextPage: Boolean
)