package infrastructure.api.graphql.di

import org.koin.dsl.module
import infrastructure.api.graphql.query.*
import infrastructure.api.graphql.mutation.*

val graphQLModule = module {
    single { ProjectQuery() }
    single { UserQuery() }
    single { OrganizationQuery() }
    single { WorkPackageQuery() }
    single { ProjectMutation() }
    single { UserMutation() }
    single { DeliverableMutation() }
    single { WorkPackageMutation() }
    single { OrganizationMutation() }
}