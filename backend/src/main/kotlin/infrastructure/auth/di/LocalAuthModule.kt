package infrastructure.auth.di

import org.koin.dsl.module
import application.usecase.interfaces.JwtUseCase
import application.usecase.interfaces.AuthProvider
import infrastructure.auth.local.LocalJwtVerifier
import infrastructure.auth.local.LocalAuthProvider

val localAuthModule = module {
    single<JwtUseCase> { LocalJwtVerifier }
    single<AuthProvider> { LocalAuthProvider(get(), get()) }
}
