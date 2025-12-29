package application.usecase.interfaces

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import application.context.UserJwt
import domain.model.User

@GraphQLIgnore
interface JwtUseCase {
    fun generateToken(user: User): String
    fun verifyToken(token: String): UserJwt
}