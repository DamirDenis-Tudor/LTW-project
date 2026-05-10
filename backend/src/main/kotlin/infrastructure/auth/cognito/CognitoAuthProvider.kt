package infrastructure.auth.cognito

import application.usecase.interfaces.AuthProvider
import domain.model.UserRole
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient
import software.amazon.awssdk.services.cognitoidentityprovider.model.*

class CognitoAuthProvider(
    private val cognitoClient: CognitoIdentityProviderClient,
    private val userPoolId: String,
    private val clientId: String
) : AuthProvider {

    override fun authenticate(username: String, password: String): String? {
        return try {
            val result = cognitoClient.initiateAuth(InitiateAuthRequest.builder()
                .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                .clientId(clientId)
                .authParameters(mapOf("USERNAME" to username, "PASSWORD" to password))
                .build())
            result.authenticationResult().idToken()
        } catch (e: Exception) {
            null
        }
    }

    override fun createUser(username: String, email: String, password: String, role: UserRole) {
        cognitoClient.adminCreateUser(AdminCreateUserRequest.builder()
            .userPoolId(userPoolId)
            .username(username)
            .temporaryPassword(password)
            .userAttributes(
                AttributeType.builder().name("email").value(email).build(),
                AttributeType.builder().name("email_verified").value("true").build(),
            )
            .messageAction(MessageActionType.SUPPRESS)
            .build())

        cognitoClient.adminSetUserPassword(AdminSetUserPasswordRequest.builder()
            .userPoolId(userPoolId)
            .username(username)
            .password(password)
            .permanent(true)
            .build())

        cognitoClient.adminAddUserToGroup(AdminAddUserToGroupRequest.builder()
            .userPoolId(userPoolId)
            .username(username)
            .groupName(role.name)
            .build())
    }

    override fun deleteUser(username: String) {
        cognitoClient.adminDeleteUser(AdminDeleteUserRequest.builder()
            .userPoolId(userPoolId)
            .username(username)
            .build())
    }
}
