package infrastructure.api.graphql.dto.input

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.input.OrganizationInputContract

@GraphQLDescription("Input for creating or updating an organization")
data class OrganizationInput(
    @GraphQLDescription("Name of the organization")
    override val name: String,
    @GraphQLDescription("PIC code of the organization")
    override val picCode: Int,
    @GraphQLDescription("Country where the organization is located")
    override val country: String
) : OrganizationInputContract