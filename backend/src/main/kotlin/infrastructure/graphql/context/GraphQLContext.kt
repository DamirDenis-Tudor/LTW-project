package infrastructure.graphql.context

import application.common.UserJwt
import application.exception.AuthenticationException
import application.exception.AuthorizationException
import application.usecase.implementation.JwtUseCaseImpl
import domain.model.UserRole
import graphql.GraphQLContext

fun GraphQLContext.getCurrentUser(): UserJwt? = get("currentUser")
fun GraphQLContext.getToken(): String? = get("token")

inline fun <T> GraphQLContext.requireUser(action: (UserJwt) -> T): T {
    val userJwt = getCurrentUser() ?: getToken()?.let { token ->
        try {
            JwtUseCaseImpl.verifyToken(token)
        } catch (e: Exception) {
            throw AuthenticationException("Invalid token")
        }
    } ?: throw AuthenticationException("Authentication required")

    return action(userJwt)
}

inline fun <T> GraphQLContext.validateRoles(
    allowedRoles: List<UserRole>,
    action: (UserJwt) -> T
): T {
    val userJwt = getCurrentUser() ?: getToken()?.let { token ->
        try {
            JwtUseCaseImpl.verifyToken(token)
        } catch (e: Exception) {
            throw AuthenticationException("Invalid token")
        }
    } ?: throw AuthenticationException("Authentication required")

    if (userJwt.role !in allowedRoles) throw AuthorizationException("Insufficient permissions")
    return action(userJwt)
}