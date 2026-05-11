import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';

interface BackendStackProps extends cdk.StackProps {
  tables: Record<string, dynamodb.Table>;
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
}

export class BackendStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly service: ecs.FargateService;
  public readonly repository: ecr.Repository;
  public readonly albDnsName: string;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc: this.vpc });

    this.repository = new ecr.Repository(this, 'BackendRepo', {
      repositoryName: 'ltw-backend',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
    });

    const taskDef = new ecs.FargateTaskDefinition(this, 'BackendTask', {
      memoryLimitMiB: 1024,
      cpu: 512,
    });

    for (const table of Object.values(props.tables)) {
      table.grantReadWriteData(taskDef.taskRole);
    }

    taskDef.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:AdminAddUserToGroup',
        'cognito-idp:AdminDeleteUser',
        'cognito-idp:AdminGetUser',
        'cognito-idp:ListUsers',
        'cognito-idp:InitiateAuth',
      ],
      resources: [props.userPool.userPoolArn],
    }));

    taskDef.addContainer('backend', {
      image: ecs.ContainerImage.fromEcrRepository(this.repository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'ltw-backend' }),
      environment: {
        COGNITO_USER_POOL_ID: props.userPool.userPoolId,
        COGNITO_CLIENT_ID: props.userPoolClient.userPoolClientId,
        AWS_REGION: this.region,
      },
      portMappings: [{ containerPort: 8080 }],
    });

    this.service = new ecs.FargateService(this, 'BackendService', {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 0,
      assignPublicIp: false,
      circuitBreaker: { rollback: true },
      minHealthyPercent: 100,
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc: this.vpc,
      internetFacing: true,
    });

    const listener = alb.addListener('HttpListener', { port: 80 });
    listener.addTargets('BackendTarget', {
      port: 8080,
      targets: [this.service],
      healthCheck: { path: '/health' },
    });

    this.albDnsName = alb.loadBalancerDnsName;

    new cdk.CfnOutput(this, 'BackendUrl', { value: `http://${alb.loadBalancerDnsName}/graphql` });
    new cdk.CfnOutput(this, 'EcrRepoUri', { value: this.repository.repositoryUri });
  }
}
