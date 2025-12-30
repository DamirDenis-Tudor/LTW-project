package infrastructure.graphql

import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.Schema
import com.expediagroup.graphql.server.ktor.GraphQL
import com.expediagroup.graphql.server.ktor.graphQLPostRoute
import com.expediagroup.graphql.server.ktor.graphQLSDLRoute
import com.expediagroup.graphql.server.ktor.graphiQLRoute
import infrastructure.graphql.context.CustomGraphQLContextFactory
import infrastructure.graphql.mutation.DeliverableMutation
import infrastructure.graphql.mutation.OrganizationMutation
import infrastructure.graphql.mutation.ProjectMutation
import infrastructure.graphql.mutation.UserMutation
import infrastructure.graphql.mutation.WorkPackageMutation
import infrastructure.graphql.query.OrganizationQuery
import infrastructure.graphql.query.ProjectQuery
import infrastructure.graphql.query.UserQuery
import infrastructure.graphql.query.WorkPackageQuery
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