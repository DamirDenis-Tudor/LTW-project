import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'ltw-users',
      selfSignUpEnabled: false,
      signInAliases: { username: true, email: true },
      passwordPolicy: { minLength: 8, requireUppercase: false, requireDigits: false, requireSymbols: false },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.userPoolClient = this.userPool.addClient('WebClient', {
      authFlows: { userPassword: true, userSrp: true },
      generateSecret: false,
    });

    for (const role of ['ADMIN', 'MANAGER', 'PARTNER']) {
      new cognito.CfnUserPoolGroup(this, `${role}Group`, {
        userPoolId: this.userPool.userPoolId,
        groupName: role,
      });
    }

    new cdk.CfnOutput(this, 'UserPoolId', { value: this.userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: this.userPoolClient.userPoolClientId });
  }
}
