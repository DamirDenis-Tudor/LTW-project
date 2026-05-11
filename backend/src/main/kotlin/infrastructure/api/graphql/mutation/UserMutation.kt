package infrastructure.api.graphql.mutation

import application.exception.AuthenticationException
import application.usecase.interfaces.UserUseCase
import com.expediagroup.graphql.server.operations.Mutation
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import domain.model.UserRole
import graphql.schema.DataFetchingEnvironment
import infrastructure.api.graphql.context.validateRoles
import infrastructure.api.graphql.dto.input.UserInput
import infrastructure.api.graphql.dto.response.UserResponse
import org.koin.core.context.GlobalContext

class UserMutation : Mutation {

    private val userUseCase = GlobalContext.get().get<UserUseCase>()

    @GraphQLDescription("Authenticate user with username and password, returns JWT token")
    fun authenticate(
        @GraphQLDescription("Username for authentication") username: String,
        @GraphQLDescription("Password for authentication") password: String
    ): String {
        return userUseCase.login(username, password)
            ?: throw AuthenticationException("Invalid credentials")
    }

    @GraphQLDescription("Register a new user (Admin only)")
    fun registerUser(
        dataFetchingEnvironment: DataFetchingEnvironment,
        @GraphQLDescription("User input data") input: UserInput
    ): UserResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) {
        return UserResponse(userUseCase.createUser(input))
    }
}
