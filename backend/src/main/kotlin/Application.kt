import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import org.koin.core.context.GlobalContext
import org.koin.ktor.plugin.Koin
import application.di.useCaseModule
import infrastructure.graphql.context.AuthenticationException
import infrastructure.graphql.context.AuthorizationException
import infrastructure.graphql.configureGraphQL
import infrastructure.graphql.di.graphQLModule
import domain.repository.*
import infrastructure.persistence.initializeSampleData
import infrastructure.persistence.di.persistenceModule

fun main() {
    embeddedServer(
        factory = Netty,
        port = 8080,
        host = "0.0.0.0",
        module = Application::module
    ).start(wait = true)
}

fun Application.module() {
    install(Koin) {
        modules(persistenceModule, useCaseModule, graphQLModule)
    }
    
    // Initialize sample data after Koin is set up
    initializeSampleData(
        GlobalContext.get().get<UserRepository>(),
        GlobalContext.get().get<OrganizationRepository>(),
        GlobalContext.get().get<ProjectRepository>(),
        GlobalContext.get().get<DeliverableRepository>(),
        GlobalContext.get().get<WorkPackageRepository>()
    )
    
    install(StatusPages) {
        exception<AuthenticationException> { call, cause ->
            call.respond(HttpStatusCode.Unauthorized, cause.message ?: "Authentication required")
        }
        exception<AuthorizationException> { call, cause ->
            call.respond(HttpStatusCode.Forbidden, cause.message ?: "Insufficient permissions")
        }
    }
    
    configureGraphQL()
}
