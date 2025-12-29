package infrastructure.graphql

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.Schema
import com.expediagroup.graphql.server.ktor.GraphQL
import com.expediagroup.graphql.server.ktor.graphQLPostRoute
import com.expediagroup.graphql.server.ktor.graphQLSDLRoute
import com.expediagroup.graphql.server.ktor.graphiQLRoute
import infrastructure.graphql.context.CustomGraphQLContextFactory
import infrastructure.graphql.mutation.DeliverableMutation
import infrastructure.graphql.mutation.ProjectMutation
import infrastructure.graphql.mutation.UserMutation
import infrastructure.graphql.mutation.WorkPackageMutation
import infrastructure.graphql.query.OrganizationQuery
import infrastructure.graphql.query.ProjectQuery
import infrastructure.graphql.query.UserQuery
import infrastructure.graphql.query.WorkPackageQuery
import io.ktor.server.application.*
import io.ktor.server.routing.*

@GraphQLDescription("GraphQL schema for EU Project Management")
class ProjectSchema : Schema

fun Application.configureGraphQL() {
    val projectQuery = ProjectQuery()
    val userQuery = UserQuery()
    val organizationQuery = OrganizationQuery()
    val workPackageQuery = WorkPackageQuery()
    val projectMutation = ProjectMutation()
    val userMutation = UserMutation()
    val deliverableMutation = DeliverableMutation()
    val workPackageMutation = WorkPackageMutation()
    
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