package infrastructure.api.graphql.dto.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.common.Page
import infrastructure.api.graphql.dto.response.WorkPackageResponse

@GraphQLDescription("Paginated work packages response")
data class PaginatedWorkPackages(
    @GraphQLDescription("List of work packages in current page")
    override val items: List<WorkPackageResponse>,
    @GraphQLDescription("Total number of work packages available")
    override val totalCount: Int,
    @GraphQLDescription("Whether there are more work packages available")
    override val hasNextPage: Boolean
) : Page<WorkPackageResponse>(items, totalCount, hasNextPage)