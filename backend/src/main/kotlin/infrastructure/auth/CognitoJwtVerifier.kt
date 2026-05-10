package infrastructure.auth

import application.common.UserJwt
import application.usecase.interfaces.JwtUseCase
import com.auth0.jwt.JWT
import domain.model.User
import domain.model.UserRole
import java.util.*

class CognitoJwtVerifier(
    userPoolId: String,
    region: String
) : JwtUseCase {

    private val issuer = "https://cognito-idp.$region.amazonaws.com/$userPoolId"

    override fun generateToken(user: User): String {
        throw UnsupportedOperationException("Cognito handles token generation")
    }

    override fun verifyToken(token: String): UserJwt {
        val decoded = JWT.decode(token)

        require(decoded.issuer == issuer) { "Invalid issuer" }
        require(decoded.expiresAt.after(Date())) { "Token expired" }

        val groups = decoded.getClaim("cognito:groups")?.asList(String::class.java) ?: emptyList()
        val role = groups.firstOrNull { it in UserRole.entries.map { r -> r.name } }
            ?.let { UserRole.valueOf(it) } ?: UserRole.PARTNER

        return UserJwt(
            id = decoded.subject ?: decoded.getClaim("sub").asString(),
            username = decoded.getClaim("cognito:username")?.asString() ?: decoded.getClaim("username")?.asString() ?: "",
            role = role,
            organizationId = decoded.getClaim("custom:organizationId")?.asString()
        )
    }
}
