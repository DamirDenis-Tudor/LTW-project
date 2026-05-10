import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const userPoolId = process.env.REACT_APP_COGNITO_USER_POOL_ID || '';
const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID || '';

const userPool = new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
});

export function cognitoLogin(username: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({ Username: username, Pool: userPool });
        const authDetails = new AuthenticationDetails({ Username: username, Password: password });

        user.authenticateUser(authDetails, {
            onSuccess: (session) => {
                resolve(session.getIdToken().getJwtToken());
            },
            onFailure: (err) => {
                reject(new Error(err.message || 'Authentication failed'));
            },
        });
    });
}

export function isUsingCognito(): boolean {
    return !!userPoolId && !!clientId;
}
