package infrastructure.persistence.di

import org.koin.dsl.module
import domain.repository.*
import infrastructure.persistence.inmemory.*

val inMemoryPersistenceModule = module {
    single<UserRepository> { InMemoryUserRepository() }
    single<OrganizationRepository> { InMemoryOrganizationRepository() }
    single<ProjectRepository> { InMemoryProjectRepository() }
    single<DeliverableRepository> { InMemoryDeliverableRepository() }
    single<WorkPackageRepository> { InMemoryWorkPackageRepository() }
}
