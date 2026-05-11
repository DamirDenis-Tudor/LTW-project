package infrastructure.api.graphql

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.Schema
import com.expediagroup.graphql.server.ktor.GraphQL
import com.expediagroup.graphql.server.ktor.graphQLPostRoute
import com.expediagroup.graphql.server.ktor.graphQLSDLRoute
import com.expediagroup.graphql.server.ktor.graphiQLRoute
import infrastructure.api.graphql.context.CustomGraphQLContextFactory
import infrastructure.api.graphql.mutation.DeliverableMutation
import infrastructure.api.graphql.mutation.OrganizationMutation
import infrastructure.api.graphql.mutation.ProjectMutation
import infrastructure.api.graphql.mutation.UserMutation
import infrastructure.api.graphql.mutation.WorkPackageMutation
import infrastructure.api.graphql.query.OrganizationQuery
import infrastructure.api.graphql.query.ProjectQuery
import infrastructure.api.graphql.query.UserQuery
import infrastructure.api.graphql.query.WorkPackageQuery
import io.ktor.server.application.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

@GraphQLDescription("GraphQL schema for EU Project Management")
class ProjectSchema : Schema

fun Application.configureGraphQL() {
    val projectQuery by inject<ProjectQuery>()
    val userQuery by inject<UserQuery>()
    val organizationQuery by inject<OrganizationQuery>()
    val workPackageQuery by inject<WorkPackageQuery>()
    val projectMutation by inject<ProjectMutation>()
    val userMutation by inject<UserMutation>()
    val organizationMutation by inject<OrganizationMutation>()
    val deliverableMutation by inject<DeliverableMutation>()
    val workPackageMutation by inject<WorkPackageMutation>()
    
    install(GraphQL) {
        schema {
            packages = listOf(
                "infrastructure.graphql",
                "domain.model.contracts",
                "application.input"
            )
            queries = listOf(
                projectQuery,
                userQuery,
                organizationQuery,
                workPackageQuery
            )
            mutations = listOf(
                projectMutation,
                userMutation,
                organizationMutation,
                deliverableMutation,
                workPackageMutation
            )
            schemaObject = ProjectSchema()
        }
        server {
            contextFactory = CustomGraphQLContextFactory()
        }
    }
    
    routing {
        graphQLPostRoute()
        graphQLSDLRoute()
        graphiQLRoute()
    }
}