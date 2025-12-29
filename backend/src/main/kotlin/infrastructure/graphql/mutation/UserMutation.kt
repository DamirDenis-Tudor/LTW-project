package infrastructure.graphql.mutation

import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import org.koin.core.context.GlobalContext
import application.input.UserInput
import application.usecase.implementation.JwtUseCaseImpl
import application.usecase.interfaces.UserUseCase
import domain.model.UserRole
import infrastructure.graphql.context.AuthenticationException
import infrastructure.graphql.context.validateRoles
import infrastructure.graphql.response.UserResponse

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