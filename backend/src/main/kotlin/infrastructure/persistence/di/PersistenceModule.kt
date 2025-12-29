package infrastructure.persistence.di

import org.koin.dsl.module
import domain.repository.*
import infrastructure.persistence.repositories.InMemoryDeliverableRepository
import infrastructure.persistence.repositories.InMemoryOrganizationRepository
import infrastructure.persistence.repositories.InMemoryProjectRepository
import infrastructure.persistence.repositories.InMemoryUserRepository
import infrastructure.persistence.repositories.InMemoryWorkPackageRepository
import infrastructure.persistence.initializeSampleData

val persistenceModule = module {
    single<UserRepository> { InMemoryUserRepository() }
    single<OrganizationRepository> { InMemoryOrganizationRepository() }
    single<ProjectRepository> { InMemoryProjectRepository() }
    single<DeliverableRepository> { InMemoryDeliverableRepository() }
    single<WorkPackageRepository> { InMemoryWorkPackageRepository() }
}