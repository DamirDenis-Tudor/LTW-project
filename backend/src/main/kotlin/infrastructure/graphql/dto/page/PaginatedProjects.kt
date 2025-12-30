package infrastructure.graphql.dto.page

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.common.Page
import infrastructure.graphql.dto.response.ProjectResponse

@GraphQLDescription("Paginated projects response")
data class PaginatedProjects(
    @GraphQLDescription("List of projects in current page")
    override val items: List<ProjectResponse>,
    @GraphQLDescription("Total number of projects available")
    override val totalCount: Int,
    @GraphQLDescription("Whether there are more projects available")
    override val hasNextPage: Boolean
) : Page<ProjectResponse>(items, totalCount, hasNextPage)