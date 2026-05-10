import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

interface PipelineStackProps extends cdk.StackProps {
  repository: ecr.Repository;
  service: ecs.IBaseService;
  frontendBucket: s3.Bucket;
  distributionId: string;
  backendUrl: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch?: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const sourceOutput = new codepipeline.Artifact('SourceOutput');
    const backendBuildOutput = new codepipeline.Artifact('BackendBuildOutput');
    const frontendBuildOutput = new codepipeline.Artifact('FrontendBuildOutput');

    // Source: GitHub (via CodeStar connection)
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'GitHub_Source',
      owner: props.githubOwner,
      repo: props.githubRepo,
      branch: props.githubBranch || 'main',
      output: sourceOutput,
      connectionArn: cdk.Fn.importValue('GitHubConnectionArn'), // create connection manually in console
    });

    // Backend Build: Docker → ECR
    const backendBuild = new codebuild.PipelineProject(this, 'BackendBuild', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true, // needed for Docker
      },
      environmentVariables: {
        ECR_REPO_URI: { value: props.repository.repositoryUri },
        AWS_ACCOUNT_ID: { value: this.account },
        AWS_DEFAULT_REGION: { value: this.region },
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec-backend.yml'),
    });

    props.repository.grantPullPush(backendBuild);

    // Frontend Build: npm build → S3
    const frontendBuild = new codebuild.PipelineProject(this, 'FrontendBuild', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      },
      environmentVariables: {
        REACT_APP_GRAPHQL_URL: { value: props.backendUrl },
        S3_BUCKET: { value: props.frontendBucket.bucketName },
        DISTRIBUTION_ID: { value: props.distributionId },
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec-frontend.yml'),
    });

    props.frontendBucket.grantReadWrite(frontendBuild);
    frontendBuild.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cloudfront:CreateInvalidation'],
      resources: [`arn:aws:cloudfront::${this.account}:distribution/${props.distributionId}`],
    }));

    // Pipeline
    new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'LTW-Pipeline',
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Backend_Build',
              project: backendBuild,
              input: sourceOutput,
              outputs: [backendBuildOutput],
            }),
            new codepipeline_actions.CodeBuildAction({
              actionName: 'Frontend_Build',
              project: frontendBuild,
              input: sourceOutput,
              outputs: [frontendBuildOutput],
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.EcsDeployAction({
              actionName: 'Deploy_Backend',
              service: props.service as ecs.FargateService,
              input: backendBuildOutput,
            }),
          ],
        },
      ],
    });
  }
}
