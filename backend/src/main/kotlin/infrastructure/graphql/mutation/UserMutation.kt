package infrastructure.graphql.mutation

import application.usecase.implementation.JwtUseCaseImpl
import application.usecase.interfaces.UserUseCase
import com.expediagroup.graphql.server.operations.Mutation
import domain.model.UserRole
import graphql.schema.DataFetchingEnvironment
import infrastructure.graphql.context.AuthenticationException
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.dto.input.UserInput
import infrastructure.graphql.dto.response.UserResponse
import org.koin.core.context.GlobalContext

class UserMutation : Mutation {

    private val userUseCase = GlobalContext.get().get<UserUseCase>()

    fun authenticate(username: String, password: String): String {
        val user = userUseCase.login(username, password)
            ?: throw AuthenticationException("Invalid credentials")
        return JwtUseCaseImpl.generateToken(user)
    }

    fun registerUser(
        dataFetchingEnvironment: DataFetchingEnvironment,
        input: UserInput
    ): UserResponse = dataFetchingEnvironment.graphQlContext.validateRoles(
        allowedRoles = listOf(UserRole.ADMIN)
    ) {
        return UserResponse(userUseCase.createUser(input))
    }
}