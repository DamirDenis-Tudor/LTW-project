#!/bin/bash
set -e

API_URL="${1:-https://djjggwiyzlv6w.cloudfront.net/graphql}"
REGION="us-east-1"
export AWS_PAGER=""
USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 10 --region $REGION --query 'UserPools[?Name==`ltw-users`].Id' --output text)

echo "=== Cleaning existing data ==="
set +e

# Clear all Cognito users
echo "Deleting Cognito users..."
USERS=$(aws cognito-idp list-users --user-pool-id $USER_POOL_ID --region $REGION --query 'Users[*].Username' --output text)
for user in $USERS; do
  aws cognito-idp admin-delete-user --user-pool-id $USER_POOL_ID --username "$user" --region $REGION
  echo "  Deleted: $user"
done

# Clear DynamoDB tables
echo "Clearing DynamoDB tables..."
TABLES=$(aws dynamodb list-tables --region $REGION --query 'TableNames[?starts_with(@,`LTW_`)]' --output text)
for table in $TABLES; do
  KEY_NAME=$(aws dynamodb describe-table --table-name "$table" --region $REGION --query 'Table.KeySchema[?KeyType==`HASH`].AttributeName' --output text)
  aws dynamodb scan --table-name "$table" --region $REGION --projection-expression "#k" --expression-attribute-names "{\"#k\":\"$KEY_NAME\"}" --query 'Items' --output json | \
    python3 -c "
import sys, json
items = json.load(sys.stdin)
for item in items:
    print(json.dumps(item))
" | while read -r key; do
    aws dynamodb delete-item --table-name "$table" --region $REGION --key "$key"
  done
  echo "  Cleared: $table"
done

echo ""
echo "=== Creating admin user ==="
set -e

aws cognito-idp admin-create-user \
  --user-pool-id $USER_POOL_ID \
  --username admin \
  --temporary-password "Admin123!" \
  --user-attributes Name=email,Value=admin@example.com Name=email_verified,Value=true \
  --message-action SUPPRESS \
  --region $REGION > /dev/null

aws cognito-idp admin-set-user-password \
  --user-pool-id $USER_POOL_ID \
  --username admin \
  --password "Admin123!" \
  --permanent \
  --region $REGION

aws cognito-idp admin-add-user-to-group \
  --user-pool-id $USER_POOL_ID \
  --username admin \
  --group-name ADMIN \
  --region $REGION

echo "  Admin user created in Cognito"

echo ""
echo "=== Seeding data via $API_URL ==="

# Helper function
gql() {
  local token="$1"
  local query="$2"
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d "{\"query\":\"$query\"}"
}

gql_id() {
  echo "$1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4
}

# Authenticate as admin
echo "Authenticating as admin..."
AUTH_RESULT=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { authenticate(username: \"admin\", password: \"Admin123!\") }"}')
TOKEN=$(echo "$AUTH_RESULT" | grep -o '"authenticate":"[^"]*"' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo "  FAILED: $AUTH_RESULT"
  exit 1
fi
echo "  Token acquired."

# Create organizations
echo "Creating organizations..."
ORG1=$(gql_id "$(gql "$TOKEN" 'mutation { createOrganization(input: {name: \"University of Technology\", picCode: 123456, country: \"Germany\"}) { id } }')")
ORG2=$(gql_id "$(gql "$TOKEN" 'mutation { createOrganization(input: {name: \"Research Institute\", picCode: 789012, country: \"France\"}) { id } }')")
ORG3=$(gql_id "$(gql "$TOKEN" 'mutation { createOrganization(input: {name: \"Innovation Labs\", picCode: 345678, country: \"Spain\"}) { id } }')")
ORG4=$(gql_id "$(gql "$TOKEN" 'mutation { createOrganization(input: {name: \"Tech Solutions\", picCode: 901234, country: \"Italy\"}) { id } }')")
echo "  ORG1=$ORG1 ORG2=$ORG2 ORG3=$ORG3 ORG4=$ORG4"

# Create users
echo "Creating users..."
R=$(gql "$TOKEN" "mutation { registerUser(input: {username: \\\"manager1\\\", email: \\\"manager1@example.com\\\", password: \\\"Manager123!\\\", role: MANAGER, organizationId: \\\"$ORG1\\\"}) { id } }")
echo "  MGR1: $R"; MGR1=$(gql_id "$R"); sleep 1
R=$(gql "$TOKEN" "mutation { registerUser(input: {username: \\\"manager2\\\", email: \\\"manager2@example.com\\\", password: \\\"Manager123!\\\", role: MANAGER, organizationId: \\\"$ORG2\\\"}) { id } }")
echo "  MGR2: $R"; MGR2=$(gql_id "$R"); sleep 1
R=$(gql "$TOKEN" "mutation { registerUser(input: {username: \\\"partner1\\\", email: \\\"partner1@example.com\\\", password: \\\"Partner123!\\\", role: PARTNER, organizationId: \\\"$ORG1\\\"}) { id } }")
echo "  PTR1: $R"; PTR1=$(gql_id "$R"); sleep 1
R=$(gql "$TOKEN" "mutation { registerUser(input: {username: \\\"partner2\\\", email: \\\"partner2@example.com\\\", password: \\\"Partner123!\\\", role: PARTNER, organizationId: \\\"$ORG2\\\"}) { id } }")
echo "  PTR2: $R"; PTR2=$(gql_id "$R"); sleep 1
R=$(gql "$TOKEN" "mutation { registerUser(input: {username: \\\"partner3\\\", email: \\\"partner3@example.com\\\", password: \\\"Partner123!\\\", role: PARTNER, organizationId: \\\"$ORG3\\\"}) { id } }")
echo "  PTR3: $R"; PTR3=$(gql_id "$R"); sleep 1
R=$(gql "$TOKEN" "mutation { registerUser(input: {username: \\\"partner4\\\", email: \\\"partner4@example.com\\\", password: \\\"Partner123!\\\", role: PARTNER, organizationId: \\\"$ORG4\\\"}) { id } }")
echo "  PTR4: $R"; PTR4=$(gql_id "$R")
echo "  MGR1=$MGR1 MGR2=$MGR2"
echo "  PTR1=$PTR1 PTR2=$PTR2 PTR3=$PTR3 PTR4=$PTR4"

# Create projects
echo "Creating projects..."
PRJ1=$(gql_id "$(gql "$TOKEN" 'mutation { createProject(input: {title: \"European AI Research\", acronym: \"EAIR\", status: ACTIVE}) { id } }')")
PRJ2=$(gql_id "$(gql "$TOKEN" 'mutation { createProject(input: {title: \"Digital Innovation Platform\", acronym: \"DIP\", status: DRAFT}) { id } }')")
PRJ3=$(gql_id "$(gql "$TOKEN" 'mutation { createProject(input: {title: \"Sustainable Technology Solutions\", acronym: \"STS\", status: COMPLETED}) { id } }')")
echo "  PRJ1=$PRJ1 PRJ2=$PRJ2 PRJ3=$PRJ3"

# Assign team members
echo "Assigning team members..."
gql "$TOKEN" "mutation { assignManagerToProject(projectId: \\\"$PRJ1\\\", managerId: \\\"$MGR1\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignManagerToProject(projectId: \\\"$PRJ2\\\", managerId: \\\"$MGR2\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignManagerToProject(projectId: \\\"$PRJ3\\\", managerId: \\\"$MGR1\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignManagerToProject(projectId: \\\"$PRJ3\\\", managerId: \\\"$MGR2\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignPartnerToProject(projectId: \\\"$PRJ1\\\", partnerId: \\\"$PTR1\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignPartnerToProject(projectId: \\\"$PRJ1\\\", partnerId: \\\"$PTR2\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignPartnerToProject(projectId: \\\"$PRJ2\\\", partnerId: \\\"$PTR2\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignPartnerToProject(projectId: \\\"$PRJ2\\\", partnerId: \\\"$PTR3\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignPartnerToProject(projectId: \\\"$PRJ2\\\", partnerId: \\\"$PTR4\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignPartnerToProject(projectId: \\\"$PRJ3\\\", partnerId: \\\"$PTR1\\\") { id } }" > /dev/null
gql "$TOKEN" "mutation { assignPartnerToProject(projectId: \\\"$PRJ3\\\", partnerId: \\\"$PTR3\\\") { id } }" > /dev/null
echo "  Done"

# Create work packages
echo "Creating work packages..."
R=$(gql "$TOKEN" "mutation { createWorkPackage(input: {projectId: \\\"$PRJ1\\\", wpNumber: 1, title: \\\"Research Phase\\\", leadPartnerId: \\\"$PTR1\\\"}) { id } }")
echo "  WP1: $R"; WP1=$(gql_id "$R")
R=$(gql "$TOKEN" "mutation { createWorkPackage(input: {projectId: \\\"$PRJ1\\\", wpNumber: 2, title: \\\"Development Phase\\\", leadPartnerId: \\\"$PTR2\\\"}) { id } }")
echo "  WP2: $R"; WP2=$(gql_id "$R")
R=$(gql "$TOKEN" "mutation { createWorkPackage(input: {projectId: \\\"$PRJ2\\\", wpNumber: 1, title: \\\"Platform Design\\\", leadPartnerId: \\\"$PTR3\\\"}) { id } }")
echo "  WP3: $R"; WP3=$(gql_id "$R")
R=$(gql "$TOKEN" "mutation { createWorkPackage(input: {projectId: \\\"$PRJ2\\\", wpNumber: 2, title: \\\"Implementation\\\", leadPartnerId: \\\"$PTR4\\\"}) { id } }")
echo "  WP4: $R"; WP4=$(gql_id "$R")
R=$(gql "$TOKEN" "mutation { createWorkPackage(input: {projectId: \\\"$PRJ3\\\", wpNumber: 1, title: \\\"Final Report\\\", leadPartnerId: \\\"$PTR1\\\"}) { id } }")
echo "  WP5: $R"; WP5=$(gql_id "$R")
echo "  WP1=$WP1 WP2=$WP2 WP3=$WP3 WP4=$WP4 WP5=$WP5"

# Create deliverables
echo "Creating deliverables..."
gql "$TOKEN" "mutation { createDeliverable(wpId: \\\"$WP1\\\", input: {description: \\\"Research report\\\", dueDate: \\\"2024-12-31\\\", assignedTo: \\\"$PTR1\\\"}) { id } }" > /dev/null
gql "$TOKEN" "mutation { createDeliverable(wpId: \\\"$WP1\\\", input: {description: \\\"Literature review\\\", dueDate: \\\"2024-11-30\\\", assignedTo: \\\"$PTR1\\\"}) { id } }" > /dev/null
gql "$TOKEN" "mutation { createDeliverable(wpId: \\\"$WP2\\\", input: {description: \\\"Prototype development\\\", dueDate: \\\"2025-03-31\\\", assignedTo: \\\"$PTR2\\\"}) { id } }" > /dev/null
gql "$TOKEN" "mutation { createDeliverable(wpId: \\\"$WP3\\\", input: {description: \\\"System architecture\\\", dueDate: \\\"2024-10-15\\\", assignedTo: \\\"$PTR3\\\"}) { id } }" > /dev/null
gql "$TOKEN" "mutation { createDeliverable(wpId: \\\"$WP4\\\", input: {description: \\\"Beta version\\\", dueDate: \\\"2025-01-15\\\", assignedTo: \\\"$PTR4\\\"}) { id } }" > /dev/null
gql "$TOKEN" "mutation { createDeliverable(wpId: \\\"$WP5\\\", input: {description: \\\"Final project report\\\", dueDate: \\\"2024-09-30\\\", assignedTo: \\\"$PTR1\\\"}) { id } }" > /dev/null
echo "  Created 6 deliverables"

echo ""
echo "✅ Seed complete!"
echo ""
echo "Credentials:"
echo "  admin    / Admin123!"
echo "  manager1 / Manager123!"
echo "  manager2 / Manager123!"
echo "  partner1 / Partner123!"
echo "  partner2 / Partner123!"
echo "  partner3 / Partner123!"
echo "  partner4 / Partner123!"
