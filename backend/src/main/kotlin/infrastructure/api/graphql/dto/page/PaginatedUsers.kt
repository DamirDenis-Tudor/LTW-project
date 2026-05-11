package infrastructure.api.graphql.dto.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.common.Page
import infrastructure.api.graphql.dto.response.UserResponse

@GraphQLDescription("Paginated users response")
data class PaginatedUsers(
    @GraphQLDescription("List of users in current page")
    override val items: List<UserResponse>,
    @GraphQLDescription("Total number of users available")
    override val totalCount: Int,
    @GraphQLDescription("Whether there are more users available")
    override val hasNextPage: Boolean
) : Page<UserResponse>(items, totalCount, hasNextPage)