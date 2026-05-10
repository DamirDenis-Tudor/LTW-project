#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from './stacks/database-stack';
import { AuthStack } from './stacks/auth-stack';
import { BackendStack } from './stacks/backend-stack';
import { FrontendStack } from './stacks/frontend-stack';

const app = new cdk.App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const database = new DatabaseStack(app, 'LTW-DatabaseStack', { env });
const auth = new AuthStack(app, 'LTW-AuthStack', { env });

const backend = new BackendStack(app, 'LTW-BackendStack', {
  env,
  tables: database.tables,
  userPool: auth.userPool,
  userPoolClient: auth.userPoolClient,
});
backend.addDependency(database);
backend.addDependency(auth);

const frontend = new FrontendStack(app, 'LTW-FrontendStack', { env });
