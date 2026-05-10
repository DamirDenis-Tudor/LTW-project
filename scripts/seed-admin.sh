#!/bin/bash
# Creates the initial admin user in Cognito after deploying LTW-AuthStack
set -e

REGION="us-east-1"
USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name LTW-AuthStack --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text)

USERNAME="admin"
PASSWORD="Admin123!"
EMAIL="admin@ltw-project.com"

echo "Creating admin user in pool: $USER_POOL_ID"

aws cognito-idp admin-create-user --region $REGION \
  --user-pool-id "$USER_POOL_ID" \
  --username "$USERNAME" \
  --user-attributes Name=email,Value="$EMAIL" Name=email_verified,Value=true \
  --message-action SUPPRESS

aws cognito-idp admin-set-user-password --region $REGION \
  --user-pool-id "$USER_POOL_ID" \
  --username "$USERNAME" \
  --password "$PASSWORD" \
  --permanent

aws cognito-idp admin-add-user-to-group --region $REGION \
  --user-pool-id "$USER_POOL_ID" \
  --username "$USERNAME" \
  --group-name ADMIN

echo "✅ Admin user created: $USERNAME / $PASSWORD"
