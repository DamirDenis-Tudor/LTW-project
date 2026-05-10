package infrastructure.persistence.di

import org.koin.dsl.module
import domain.repository.*
import infrastructure.persistence.dynamodb.*
import software.amazon.awssdk.services.dynamodb.DynamoDbClient

val dynamoPersistenceModule = module {
    single { DynamoDbClient.create() }
    single<UserRepository> { DynamoUserRepository(get()) }
    single<OrganizationRepository> { DynamoOrganizationRepository(get()) }
    single<ProjectRepository> { DynamoProjectRepository(get()) }
    single<DeliverableRepository> { DynamoDeliverableRepository(get()) }
    single<WorkPackageRepository> { DynamoWorkPackageRepository(get()) }
}
