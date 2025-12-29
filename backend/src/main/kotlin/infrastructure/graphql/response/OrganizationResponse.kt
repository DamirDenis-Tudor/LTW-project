package infrastructure.graphql.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.OrganizationContract
import domain.repository.*
import infrastructure.graphql.response.page.PaginatedUsers

@GraphQLDescription("Organization response with additional GraphQL fields")
class OrganizationResponse(
    private val organization: OrganizationContract
) : OrganizationContract by organization {

    private val userRepository = GlobalContext.get().get<UserRepository>()

    @GraphQLDescription("Get all users belonging to this organization")
    fun users(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedUsers {
        val users = userRepository.findByOrganizationId(organization.id, limit, offset)
        val totalCount = userRepository.countByOrganizationId(organization.id)
        val paginatedItems = users.map { UserResponse(it) }
        return PaginatedUsers(
            items = paginatedItems,
            totalCount = totalCount,
            hasNextPage = offset + limit < totalCount
        )
    }
}