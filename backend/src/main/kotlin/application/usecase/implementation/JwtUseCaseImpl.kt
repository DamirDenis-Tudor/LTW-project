package application.usecase.implementation

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import application.context.UserJwt
import application.usecase.interfaces.JwtUseCase
import domain.model.User
import domain.model.UserRole
import java.util.*

object JwtUseCaseImpl : JwtUseCase {
    private val secret = "eu-project-secret"
    private val algorithm = Algorithm.HMAC256(secret)
    private val issuer = "eu-project-manager"
    
    override fun generateToken(user: User): String {
        return JWT.create()
            .withIssuer(issuer)
            .withSubject(user.id)
            .withClaim("username", user.username)
            .withClaim("role", user.role.name)
            .withClaim("organizationId", user.organizationId)
            .withExpiresAt(Date(System.currentTimeMillis() + 3600000)) // 1 hour
            .sign(algorithm)
    }
    
    override fun verifyToken(token: String): UserJwt {
        val jwt = JWT.require(algorithm)
            .withIssuer(issuer)
            .build()
            .verify(token)
        
        return UserJwt(
            id = jwt.subject,
            username = jwt.getClaim("username").asString(),
            role = UserRole.valueOf(jwt.getClaim("role").asString()),
            organizationId = jwt.getClaim("organizationId")?.asString()
        )
    }
}