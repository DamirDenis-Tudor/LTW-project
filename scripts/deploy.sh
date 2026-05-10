#!/bin/bash
set -e

REGION="us-east-1"

echo "=== 1. Deploying CDK stacks ==="
cd infra
npx cdk deploy LTW-DatabaseStack LTW-AuthStack LTW-FrontendStack LTW-BackendStack --require-approval never

echo "=== 2. Getting stack outputs ==="
ECR_URI=$(aws cloudformation describe-stacks --stack-name LTW-BackendStack --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`EcrRepoUri`].OutputValue' --output text)
BACKEND_URL=$(aws cloudformation describe-stacks --stack-name LTW-BackendStack --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`BackendUrl`].OutputValue' --output text)
BUCKET=$(aws cloudformation describe-stacks --stack-name LTW-FrontendStack --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)
DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name LTW-FrontendStack --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text)
FRONTEND_URL=$(aws cloudformation describe-stacks --stack-name LTW-FrontendStack --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendUrl`].OutputValue' --output text)

echo "ECR: $ECR_URI"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"

echo "=== 3. Building and pushing Docker image ==="
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI
cd ../backend
docker build -t $ECR_URI:latest .
docker push $ECR_URI:latest

echo "=== 4. Forcing ECS redeployment ==="
CLUSTER=$(aws ecs list-clusters --region $REGION --query 'clusterArns[0]' --output text)
SERVICE=$(aws ecs list-services --cluster $CLUSTER --region $REGION --query 'serviceArns[0]' --output text)
aws ecs update-service --cluster $CLUSTER --service $SERVICE --force-new-deployment --region $REGION

echo "=== 5. Seeding admin user ==="
cd ..
./scripts/seed-admin.sh

echo "=== 6. Building and deploying frontend ==="
cd frontend
REACT_APP_GRAPHQL_URL=$BACKEND_URL npm run build
aws s3 sync build/ s3://$BUCKET --delete
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo ""
echo "✅ Deployment complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo "Admin:    admin / Admin123!"
