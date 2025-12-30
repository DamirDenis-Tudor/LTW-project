package infrastructure.graphql.dto.input

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import application.input.UserInputContract
import domain.model.UserRole

@GraphQLDescription("Input for creating or updating a user")
data class UserInput(
    @GraphQLDescription("Username for the user")
    override val username: String,
    @GraphQLDescription("Email address of the user")
    override val email: String,
    @GraphQLDescription("Password for the user")
    override val password: String,
    @GraphQLDescription("Role of the user in the system")
    override val role: UserRole,
    @GraphQLDescription("ID of the organization this user belongs to")
    override val organizationId: String? = null
) : UserInputContract