package application.di

import org.koin.dsl.module
import application.usecase.interfaces.*
import application.usecase.implementation.*

val useCaseModule = module {
    single<UserUseCase> { UserUseCaseImpl(get()) }
    single<OrganizationUseCase> { OrganizationUseCaseImpl(get()) }
    single<ProjectUseCase> { ProjectUseCaseImpl(get()) }
    single<DeliverableUseCase> { DeliverableUseCaseImpl(get(), get(), get()) }
    single<WorkPackageUseCase> { WorkPackageUseCaseImpl(get()) }
}