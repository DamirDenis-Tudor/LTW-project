package infrastructure.graphql.di

import org.koin.dsl.module
import infrastructure.graphql.query.*
import infrastructure.graphql.mutation.*

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