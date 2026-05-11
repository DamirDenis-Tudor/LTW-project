import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.plugins.cors.routing.CORS
import org.koin.core.module.Module
import org.koin.core.context.GlobalContext
import org.koin.ktor.plugin.Koin
import org.slf4j.LoggerFactory
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
import infrastructure.persistence.inmemory.initializeSampleData

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
    val logger = LoggerFactory.getLogger("Application")

    install(CallLogging)

    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
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
            logger.warn("Auth error: ${cause.message}")
            call.respond(HttpStatusCode.Unauthorized, cause.message ?: "Authentication required")
        }
        exception<AuthorizationException> { call, cause ->
            logger.warn("Authorization error: ${cause.message}")
            call.respond(HttpStatusCode.Forbidden, cause.message ?: "Insufficient permissions")
        }
        exception<NotFoundException> { call, cause ->
            logger.warn("Not found: ${cause.message}")
            call.respond(HttpStatusCode.NotFound, cause.message ?: "Not found")
        }
        exception<AlreadyExistsException> { call, cause ->
            logger.warn("Conflict: ${cause.message}")
            call.respond(HttpStatusCode.Conflict, cause.message ?: "Already exists")
        }
        exception<Throwable> { call, cause ->
            logger.error("Unhandled exception", cause)
            call.respond(HttpStatusCode.InternalServerError, cause.message ?: "Internal server error")
        }
    }

    routing {
        get("/health") { call.respondText("OK") }
    }

    configureGraphQL()
}
