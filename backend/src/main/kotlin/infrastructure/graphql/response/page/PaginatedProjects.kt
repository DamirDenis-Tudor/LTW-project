package infrastructure.graphql.response.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import infrastructure.graphql.response.ProjectResponse

@GraphQLDescription("Paginated projects response")
data class PaginatedProjects(
    @GraphQLDescription("List of projects in current page")
    val items: List<ProjectResponse>,
    @GraphQLDescription("Total number of projects available")
    val totalCount: Int,
    @GraphQLDescription("Whether there are more projects available")
    val hasNextPage: Boolean
)