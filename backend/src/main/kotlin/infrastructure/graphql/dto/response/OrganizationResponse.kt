package infrastructure.graphql.dto.response

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import org.koin.core.context.GlobalContext
import domain.model.contracts.OrganizationContract
import application.usecase.interfaces.OrganizationUseCase
import infrastructure.graphql.dto.page.PaginatedUsers

@GraphQLDescription("Organization response with additional GraphQL fields")
class OrganizationResponse(
    private val organization: OrganizationContract
) : OrganizationContract by organization {

    private val organizationUseCase = GlobalContext.get().get<OrganizationUseCase>()

    @GraphQLDescription("Unique identifier for the organization")
    override val id: String get() = organization.id
    
    @GraphQLDescription("Name of the organization")
    override val name: String get() = organization.name
    
    @GraphQLDescription("PIC code of the organization")
    override val picCode: Int get() = organization.picCode
    
    @GraphQLDescription("Country where the organization is located")
    override val country: String get() = organization.country

    @GraphQLDescription("Get all users belonging to this organization")
    fun users(
        @GraphQLDescription("Maximum number of items to return") limit: Int = 10,
        @GraphQLDescription("Number of items to skip") offset: Int = 0
    ): PaginatedUsers {
        val page = organizationUseCase.getOrganizationUsers(organization.id, limit, offset)
        return PaginatedUsers(
            items =  page.items.map { UserResponse(it) },
            totalCount = page.totalCount,
            hasNextPage = page.hasNextPage
        )
    }
}