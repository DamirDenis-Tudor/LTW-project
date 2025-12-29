package infrastructure.graphql.response.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import infrastructure.graphql.response.WorkPackageResponse

@GraphQLDescription("Paginated work packages response")
data class PaginatedWorkPackages(
    @GraphQLDescription("List of work packages in current page")
    val items: List<WorkPackageResponse>,
    @GraphQLDescription("Total number of work packages available")
    val totalCount: Int,
    @GraphQLDescription("Whether there are more work packages available")
    val hasNextPage: Boolean
)