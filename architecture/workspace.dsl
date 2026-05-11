workspace {

    model {
        # Level 1 - Actors
        admin = person "Admin" "Full access to all projects, users, and organizations"
        manager = person "Manager" "Manages assigned projects, creates work packages, assigns partners"
        partner = person "Partner" "Views assigned projects, updates deliverable submission status"

        github = softwareSystem "GitHub" "Source code repository (triggers pipeline on push to main)" {
            tags "GitHub"
        }

        ltw = softwareSystem "EU Project Manager" "Management platform for European consortium projects with role-based access control" {

            s3 = container "S3 Bucket" "Hosts React SPA build artifacts. BLOCK_ALL public access. Auto-delete on destroy." "AWS S3" {
                tags "Amazon Web Services - Simple Storage Service Bucket"
            }
            cloudfront = container "CloudFront Distribution" "Default behavior: S3 via OAC. /graphql behavior: ALB HTTP origin (cache disabled). SPA fallback: 403/404 -> index.html" "AWS CloudFront" {
                tags "Amazon Web Services - CloudFront"
            }

            cognito = container "Cognito" "User authentication and authorization" "AWS Cognito" {
                tags "Amazon Web Services - Cognito"

                userPool = component "User Pool" "ltw-users. Sign-in: username + email. Password: min 8 chars. Self-signup disabled." "AWS Cognito"
                poolClient = component "User Pool Client" "Auth flows: USER_PASSWORD_AUTH, USER_SRP_AUTH. No client secret." "AWS Cognito"
                groups = component "Groups" "ADMIN, MANAGER, PARTNER" "AWS Cognito"
            }

            # --- Backend ---
            group "VPC" {
                alb = container "ALB" "Internet-facing Application Load Balancer. Listener: port 80. Target group: port 8080, health check /health" "AWS Elastic Load Balancing" {
                    tags "Amazon Web Services - Elastic Load Balancing"
                }
                nat = container "NAT Gateway" "1 NAT Gateway in public subnet. Enables outbound internet for private subnets." "AWS VPC" {
                    tags "Amazon Web Services - VPC NAT Gateway"
                }
                backendApi = container "Ktor Service" "Private subnets, assignPublicIp: false. Task: 512 CPU, 1024 MB. Circuit breaker with rollback. Image from ECR." "Kotlin, Ktor, graphql-kotlin" {
                    tags "Amazon Web Services - Fargate"

                    auth = component "infrastructure.auth" "CognitoAuthProvider, CognitoJwtVerifier, LocalAuthProvider, LocalJwtVerifier" "AWS SDK, nimbus-jose-jwt"
                    graphql = component "infrastructure.api.graphql" "GraphQLConfig, ProjectQuery, UserQuery, OrganizationQuery, WorkPackageQuery, UserMutation, ProjectMutation, OrganizationMutation, WorkPackageMutation, DeliverableMutation, GraphQLContextFactory" "graphql-kotlin, Ktor"
                    persistence = component "infrastructure.persistence" "DynamoUserRepository, DynamoOrganizationRepository, DynamoProjectRepository, DynamoWorkPackageRepository, DynamoDeliverableRepository" "AWS DynamoDB SDK"
                    usecases = component "application.usecase" "UserUseCaseImpl, ProjectUseCaseImpl, OrganizationUseCaseImpl, WorkPackageUseCaseImpl, DeliverableUseCaseImpl, AuthProvider (interface), JwtUseCase (interface)" "Kotlin"
                    domainModel = component "domain.model" "User, Project, Organization, WorkPackage, Deliverable, UserRole" "Kotlin data classes"
                    domainRepo = component "domain.repository" "UserRepository, ProjectRepository, OrganizationRepository, WorkPackageRepository, DeliverableRepository" "Kotlin interfaces"
                }
                ecr = container "ECR Repository" "ltw-backend. RemovalPolicy: DESTROY, emptyOnDelete: true" "AWS ECR" {
                    tags "Amazon Web Services - Elastic Container Registry"
                }
                logs = container "CloudWatch Logs" "Log group with stream prefix: ltw-backend" "AWS CloudWatch" {
                    tags "Amazon Web Services - CloudWatch"
                }
                taskRole = container "IAM Task Role" "DynamoDB ReadWrite (all LTW_ tables), Cognito Admin actions" "AWS IAM" {
                    tags "Amazon Web Services - Identity and Access Management"
                }
            }

            dynamodb = container "DynamoDB" "NoSQL database, PAY_PER_REQUEST billing" "AWS DynamoDB" {
                tags "Amazon Web Services - DynamoDB"

                usersTable = component "LTW_Users" "PK: id | username, email, passwordHash, role, organizationId" "DynamoDB Table"
                orgsTable = component "LTW_Organizations" "PK: id | name, picCode, country" "DynamoDB Table"
                projectsTable = component "LTW_Projects" "PK: id | title, acronym, status, managerIds (SS), partnerIds (SS), workPackageIds (SS)" "DynamoDB Table"
                wpTable = component "LTW_WorkPackages" "PK: id | projectId, wpNumber, title, leadPartnerId" "DynamoDB Table"
                delTable = component "LTW_Deliverables" "PK: id | workPackageId, description, dueDate, isSubmitted, assignedTo" "DynamoDB Table"
            }

            cicd = container "CI/CD Pipeline" "Automated build and deploy from GitHub" "AWS CodePipeline + CodeBuild" {
                tags "Amazon Web Services - CodePipeline"

                pipeline = component "CodePipeline" "Stages: Source (GitHub CodeStar), Build (parallel), Deploy (ECS)" "AWS CodePipeline"
                backendBuild = component "CodeBuild - Backend" "STANDARD_7_0, privileged (Docker). Builds Docker image, pushes to ECR." "AWS CodeBuild"
                frontendBuild = component "CodeBuild - Frontend" "STANDARD_7_0. npm build, deploys to S3, invalidates CloudFront." "AWS CodeBuild"
            }
        }

        # Level 1 - Context
        admin -> ltw "Manages all users, organizations, and projects"
        manager -> ltw "Manages assigned projects and work packages"
        partner -> ltw "Views projects and updates deliverable status"

        # Level 2 - Container relationships
        admin -> cloudfront "HTTPS"
        manager -> cloudfront "HTTPS"
        partner -> cloudfront "HTTPS"
        cloudfront -> s3 "Default behavior: S3 Origin (OAC)"
        cloudfront -> alb "/graphql behavior: HTTP origin, cache disabled"
        alb -> backendApi "Target group port 8080"
        backendApi -> nat "All outbound traffic (DynamoDB, Cognito, ECR)"
        backendApi -> logs "awsLogs driver"
        nat -> cognito "Cognito API"
        nat -> dynamodb "DynamoDB API"
        nat -> ecr "Docker image pull on task start"
        github -> pipeline "Push to main triggers pipeline (CodeStar Connection)"
        cicd -> ecr "Pushes Docker image"
        cicd -> s3 "Deploys frontend"
        cicd -> cloudfront "Cache invalidation"
        cicd -> backendApi "ECS Deploy"

        # Level 3 - CI/CD component relationships
        pipeline -> backendBuild "Build stage (parallel)"
        pipeline -> frontendBuild "Build stage (parallel)"
        backendBuild -> ecr "docker push"
        frontendBuild -> s3 "S3 sync"
        frontendBuild -> cloudfront "CreateInvalidation"
        pipeline -> backendApi "Deploy stage: ECS Deploy"

        # Level 3 - Package dependencies (onion architecture)
        graphql -> usecases "Delegates"
        usecases -> domainRepo "Uses interfaces"
        usecases -> domainModel "Uses entities"
        auth -> usecases "Implements AuthProvider, JwtUseCase"
        persistence -> domainRepo "Implements repositories"
        persistence -> domainModel "Maps entities"
        auth -> cognito "AWS SDK (via NAT)"
        persistence -> dynamodb "DynamoDB SDK (via NAT)"

    }

    views {
        systemContext ltw "C1-System-Context" "C1 - System Context" {
            include *
            exclude github
            autoLayout
        }

        container ltw "C2-Containers" "C2 - Containers" {
            include *
            autoLayout
        }

        component backendApi "C3-Ktor-Service" "C3 - Ktor Service Components" {
            include *
            autoLayout lr
        }

        component cicd "C3-CICD" "C3 - CI/CD Pipeline" {
            include *
            include ecr backendApi s3 cloudfront
            autoLayout
        }

        theme https://static.structurizr.com/themes/amazon-web-services-2023.01.31/theme.json

        styles {
            element "Person" {
                shape Person
            }
            element "Browser" {
                shape WebBrowser
            }
            element "GitHub" {
                icon https://github.githubassets.com/favicons/favicon-dark.svg
                shape RoundedBox
            }
            element "Group:VPC" {
                icon https://static.structurizr.com/themes/amazon-web-services-2023.01.31/Res_Amazon-VPC_Virtual-private-cloud-VPC_48_Light.png
            }
        }
    }

}
