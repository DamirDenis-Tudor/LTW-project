import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.plugins.cors.routing.CORS
import org.koin.core.module.Module
import org.koin.core.context.GlobalContext
import org.koin.ktor.plugin.Koin
import application.di.useCaseModule
import application.exception.AlreadyExistsException
import application.exception.AuthenticationException
import application.exception.AuthorizationException
import application.exception.NotFoundException
import application.usecase.interfaces.*
import infrastructure.graphql.configureGraphQL
import infrastructure.graphql.di.graphQLModule
import infrastructure.persistence.di.inMemoryPersistenceModule
import infrastructure.persistence.di.dynamoPersistenceModule
import infrastructure.auth.di.localAuthModule
import infrastructure.auth.di.cloudAuthModule
import infrastructure.persistence.initializeSampleData

fun localModules(): List<Module> = listOf(
    inMemoryPersistenceModule,
    localAuthModule,
    useCaseModule,
    graphQLModule,
)

fun cloudModules(): List<Module> = listOf(
    dynamoPersistenceModule,
    cloudAuthModule,
    useCaseModule,
    graphQLModule,
)

fun main() {
    embeddedServer(
        factory = Netty,
        port = 8080,
        host = "0.0.0.0",
        module = Application::module
    ).start(wait = true)
}

fun Application.module() {
    install(CORS) {
        allowHost("localhost:3000", schemes = listOf("http", "https"))
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowCredentials = true
    }

    val isCloud = System.getenv("AWS_REGION") != null

    install(Koin) {
        modules(if (isCloud) cloudModules() else localModules())
    }

    // Initialize sample data only in local mode
    if (!isCloud) {
        initializeSampleData(
            GlobalContext.get().get<UserUseCase>(),
            GlobalContext.get().get<OrganizationUseCase>(),
            GlobalContext.get().get<ProjectUseCase>(),
            GlobalContext.get().get<DeliverableUseCase>(),
            GlobalContext.get().get<WorkPackageUseCase>()
        )
    }

    install(StatusPages) {
        exception<AuthenticationException> { call, cause ->
            call.respond(HttpStatusCode.Unauthorized, cause.message ?: "Authentication required")
        }
        exception<AuthorizationException> { call, cause ->
            call.respond(HttpStatusCode.Forbidden, cause.message ?: "Insufficient permissions")
        }
        exception<NotFoundException> { call, cause ->
            call.respond(HttpStatusCode.NotFound, cause.message ?: "Not found")
        }
        exception<AlreadyExistsException> { call, cause ->
            call.respond(HttpStatusCode.Conflict, cause.message ?: "Already exists")
        }
    }

    configureGraphQL()
}
