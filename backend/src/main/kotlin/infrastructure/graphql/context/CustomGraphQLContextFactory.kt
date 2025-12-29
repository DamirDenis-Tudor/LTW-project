package infrastructure.graphql.context

import com.expediagroup.graphql.generator.extensions.toGraphQLContext
import com.expediagroup.graphql.server.ktor.KtorGraphQLContextFactory
import graphql.GraphQLContext
import io.ktor.server.request.*
import application.usecase.implementation.JwtUseCaseImpl

class CustomGraphQLContextFactory : KtorGraphQLContextFactory() {
    override suspend fun generateContext(request: ApplicationRequest): GraphQLContext {
        val authHeader = request.headers["Authorization"]
        val token = authHeader?.removePrefix("Bearer ")?.trim()
        
        val context = mutableMapOf<String, Any>()
        
        token?.takeIf { it.isNotEmpty() }?.let {
            context["token"] = it
            runCatching {
                JwtUseCaseImpl.verifyToken(it).let { user ->
                    context["currentUser"] = user
                }
            }
        }
        
        return context.toGraphQLContext()
    }
}