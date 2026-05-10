package infrastructure.auth.di

import org.koin.dsl.module
import application.usecase.interfaces.JwtUseCase
import application.usecase.interfaces.AuthProvider
import application.usecase.implementation.JwtUseCaseImpl
import infrastructure.auth.NoOpAuthProvider

val localAuthModule = module {
    single<JwtUseCase> { JwtUseCaseImpl }
    single<AuthProvider> { NoOpAuthProvider }
}
