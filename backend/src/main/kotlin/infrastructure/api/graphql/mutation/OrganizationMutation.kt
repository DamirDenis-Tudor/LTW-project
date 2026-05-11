package infrastructure.api.graphql.mutation

import application.usecase.interfaces.OrganizationUseCase
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Mutation
import domain.model.UserRole
import graphql.schema.DataFetchingEnvironment
import infrastructure.api.graphql.context.validateRoles
import infrastructure.api.graphql.dto.input.OrganizationInput
import infrastructure.api.graphql.dto.response.OrganizationResponse
import org.koin.core.context.GlobalContext

class OrganizationMutation : Mutation {

    private val organizationUseCase = GlobalContext.get().get<OrganizationUseCase>()

    @GraphQLDescription("Create a new organization (Admin only)")
    fun createOrganization(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("Organization input data") input: OrganizationInput
    ): OrganizationResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) {
        val organization = organizationUseCase.createOrganization(input)
        OrganizationResponse(organization)
    }
}