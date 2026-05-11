#!/bin/bash
set -e

API_URL="${1:-https://djjggwiyzlv6w.cloudfront.net/graphql}"
REGION="us-east-1"
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
  --region $REGION

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

# Helper functions
gql() {
  local token="$1"
  local query="$2"
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d "$query"
}

gql_id() {
  echo "$1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4
}

# Authenticate as admin
echo "Authenticating as admin..."
TOKEN=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { authenticate(username: \"admin\", password: \"Admin123!\") }"}' \
  | grep -o '"authenticate":"[^"]*"' | cut -d'"' -f4)
echo "  Token acquired."

# Create organizations
echo "Creating organizations..."
ORG1=$(gql_id "$(gql "$TOKEN" '{"query":"mutation { createOrganization(input: {name: \"University of Technology\", picCode: 123456, country: \"Germany\"}) { id } }"}')")
ORG2=$(gql_id "$(gql "$TOKEN" '{"query":"mutation { createOrganization(input: {name: \"Research Institute\", picCode: 789012, country: \"France\"}) { id } }"}')")
ORG3=$(gql_id "$(gql "$TOKEN" '{"query":"mutation { createOrganization(input: {name: \"Innovation Labs\", picCode: 345678, country: \"Spain\"}) { id } }"}')")
ORG4=$(gql_id "$(gql "$TOKEN" '{"query":"mutation { createOrganization(input: {name: \"Tech Solutions\", picCode: 901234, country: \"Italy\"}) { id } }"}')")
echo "  Created 4 organizations"

# Create users
echo "Creating users..."
MGR1=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { registerUser(input: {username: \\\"manager1\\\", email: \\\"manager1@example.com\\\", password: \\\"Manager123!\\\", role: MANAGER, organizationId: \\\"$ORG1\\\"}) { id } }\"}")")
MGR2=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { registerUser(input: {username: \\\"manager2\\\", email: \\\"manager2@example.com\\\", password: \\\"Manager123!\\\", role: MANAGER, organizationId: \\\"$ORG2\\\"}) { id } }\"}")")
PTR1=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { registerUser(input: {username: \\\"partner1\\\", email: \\\"partner1@example.com\\\", password: \\\"Partner123!\\\", role: PARTNER, organizationId: \\\"$ORG1\\\"}) { id } }\"}")")
PTR2=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { registerUser(input: {username: \\\"partner2\\\", email: \\\"partner2@example.com\\\", password: \\\"Partner123!\\\", role: PARTNER, organizationId: \\\"$ORG2\\\"}) { id } }\"}")")
PTR3=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { registerUser(input: {username: \\\"partner3\\\", email: \\\"partner3@example.com\\\", password: \\\"Partner123!\\\", role: PARTNER, organizationId: \\\"$ORG3\\\"}) { id } }\"}")")
PTR4=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { registerUser(input: {username: \\\"partner4\\\", email: \\\"partner4@example.com\\\", password: \\\"Partner123!\\\", role: PARTNER, organizationId: \\\"$ORG4\\\"}) { id } }\"}")")
echo "  Created 6 users"

# Create projects
echo "Creating projects..."
PRJ1=$(gql_id "$(gql "$TOKEN" '{"query":"mutation { createProject(input: {title: \"European AI Research\", acronym: \"EAIR\", status: ACTIVE}) { id } }"}')")
PRJ2=$(gql_id "$(gql "$TOKEN" '{"query":"mutation { createProject(input: {title: \"Digital Innovation Platform\", acronym: \"DIP\", status: DRAFT}) { id } }"}')")
PRJ3=$(gql_id "$(gql "$TOKEN" '{"query":"mutation { createProject(input: {title: \"Sustainable Technology Solutions\", acronym: \"STS\", status: COMPLETED}) { id } }"}')")
echo "  Created 3 projects"

# Assign team members
echo "Assigning team members..."
gql "$TOKEN" "{\"query\":\"mutation { addManagerToProject(projectId: \\\"$PRJ1\\\", userId: \\\"$MGR1\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addManagerToProject(projectId: \\\"$PRJ2\\\", userId: \\\"$MGR2\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addManagerToProject(projectId: \\\"$PRJ3\\\", userId: \\\"$MGR1\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addManagerToProject(projectId: \\\"$PRJ3\\\", userId: \\\"$MGR2\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addPartnerToProject(projectId: \\\"$PRJ1\\\", userId: \\\"$PTR1\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addPartnerToProject(projectId: \\\"$PRJ1\\\", userId: \\\"$PTR2\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addPartnerToProject(projectId: \\\"$PRJ2\\\", userId: \\\"$PTR2\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addPartnerToProject(projectId: \\\"$PRJ2\\\", userId: \\\"$PTR3\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addPartnerToProject(projectId: \\\"$PRJ2\\\", userId: \\\"$PTR4\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addPartnerToProject(projectId: \\\"$PRJ3\\\", userId: \\\"$PTR1\\\") { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { addPartnerToProject(projectId: \\\"$PRJ3\\\", userId: \\\"$PTR3\\\") { id } }\"}" > /dev/null
echo "  Done"

# Create work packages
echo "Creating work packages..."
WP1=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { createWorkPackage(input: {projectId: \\\"$PRJ1\\\", wpNumber: 1, title: \\\"Research Phase\\\", leadPartnerId: \\\"$PTR1\\\"}) { id } }\"}")")
WP2=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { createWorkPackage(input: {projectId: \\\"$PRJ1\\\", wpNumber: 2, title: \\\"Development Phase\\\", leadPartnerId: \\\"$PTR2\\\"}) { id } }\"}")")
WP3=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { createWorkPackage(input: {projectId: \\\"$PRJ2\\\", wpNumber: 1, title: \\\"Platform Design\\\", leadPartnerId: \\\"$PTR3\\\"}) { id } }\"}")")
WP4=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { createWorkPackage(input: {projectId: \\\"$PRJ2\\\", wpNumber: 2, title: \\\"Implementation\\\", leadPartnerId: \\\"$PTR4\\\"}) { id } }\"}")")
WP5=$(gql_id "$(gql "$TOKEN" "{\"query\":\"mutation { createWorkPackage(input: {projectId: \\\"$PRJ3\\\", wpNumber: 1, title: \\\"Final Report\\\", leadPartnerId: \\\"$PTR1\\\"}) { id } }\"}")")
echo "  Created 5 work packages"

# Create deliverables
echo "Creating deliverables..."
gql "$TOKEN" "{\"query\":\"mutation { createDeliverable(workPackageId: \\\"$WP1\\\", input: {description: \\\"Research report\\\", dueDate: \\\"2024-12-31\\\", assignedTo: \\\"$PTR1\\\"}) { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { createDeliverable(workPackageId: \\\"$WP1\\\", input: {description: \\\"Literature review\\\", dueDate: \\\"2024-11-30\\\", assignedTo: \\\"$PTR1\\\"}) { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { createDeliverable(workPackageId: \\\"$WP2\\\", input: {description: \\\"Prototype development\\\", dueDate: \\\"2025-03-31\\\", assignedTo: \\\"$PTR2\\\"}) { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { createDeliverable(workPackageId: \\\"$WP3\\\", input: {description: \\\"System architecture\\\", dueDate: \\\"2024-10-15\\\", assignedTo: \\\"$PTR3\\\"}) { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { createDeliverable(workPackageId: \\\"$WP4\\\", input: {description: \\\"Beta version\\\", dueDate: \\\"2025-01-15\\\", assignedTo: \\\"$PTR4\\\"}) { id } }\"}" > /dev/null
gql "$TOKEN" "{\"query\":\"mutation { createDeliverable(workPackageId: \\\"$WP5\\\", input: {description: \\\"Final project report\\\", dueDate: \\\"2024-09-30\\\", assignedTo: \\\"$PTR1\\\"}) { id } }\"}" > /dev/null
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
