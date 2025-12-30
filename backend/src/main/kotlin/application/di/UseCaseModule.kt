package application.di

import org.koin.dsl.module
import application.usecase.interfaces.*
import application.usecase.implementation.*

val useCaseModule = module {
    single<UserUseCase> { UserUseCaseImpl(get(), get(), get()) }
    single<OrganizationUseCase> { OrganizationUseCaseImpl(get(), get()) }
    single<ProjectUseCase> { ProjectUseCaseImpl(get()) }
    single<DeliverableUseCase> { DeliverableUseCaseImpl(get(), get(), get(), get()) }
    single<WorkPackageUseCase> { WorkPackageUseCaseImpl(get(), get(), get()) }
}