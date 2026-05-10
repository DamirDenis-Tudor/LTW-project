package infrastructure.auth.di

import org.koin.dsl.module
import application.usecase.interfaces.JwtUseCase
import application.usecase.interfaces.AuthProvider
import infrastructure.auth.cognito.CognitoJwtVerifier
import infrastructure.auth.cognito.CognitoAuthProvider
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient

val cloudAuthModule = module {
    single { CognitoIdentityProviderClient.create() }
    single<JwtUseCase> {
        CognitoJwtVerifier(
            userPoolId = System.getenv("COGNITO_USER_POOL_ID"),
            region = System.getenv("AWS_REGION")
        )
    }
    single<AuthProvider> {
        CognitoAuthProvider(get(), System.getenv("COGNITO_USER_POOL_ID"), System.getenv("COGNITO_CLIENT_ID"))
    }
}
