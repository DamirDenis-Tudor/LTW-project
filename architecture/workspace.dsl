workspace {

    model {
        user = person "User"
        github = softwareSystem "GitHub" "Source code repository" {
            tags "Amazon Web Services - CodeCommit"
        }

        ltw = softwareSystem "LTW Platform" {

            cdn = container "CloudFront" "CDN and request routing" {
                tags "Amazon Web Services - CloudFront"
            }
            s3 = container "S3 Bucket" "Static frontend assets (OAC)" {
                tags "Amazon Web Services - Simple Storage Service S3"
            }

            group "VPC (2 AZs, 1 NAT Gateway)" {
                alb = container "ALB" "Public Subnet - Internet-facing" {
                    tags "Amazon Web Services - Elastic Load Balancing"
                }
                nat = container "NAT Gateway" "Public Subnet - Outbound internet" {
                    tags "Amazon Web Services - NAT Gateway"
                }
                backend = container "ECS Fargate" "Private Subnet - Ktor GraphQL API (512 CPU, 1024 MB)" {
                    tags "Amazon Web Services - Fargate"
                }
            }

            cognito = container "Cognito User Pool" "Authentication, JWT, user groups (ADMIN, MANAGER, PARTNER)" {
                tags "Amazon Web Services - Cognito"
            }
            users = container "LTW_Users" "PAY_PER_REQUEST" {
                tags "Amazon Web Services - DynamoDB"
            }
            orgs = container "LTW_Organizations" "PAY_PER_REQUEST" {
                tags "Amazon Web Services - DynamoDB"
            }
            projects = container "LTW_Projects" "PAY_PER_REQUEST" {
                tags "Amazon Web Services - DynamoDB"
            }
            workpackages = container "LTW_WorkPackages" "PAY_PER_REQUEST" {
                tags "Amazon Web Services - DynamoDB"
            }
            deliverables = container "LTW_Deliverables" "PAY_PER_REQUEST" {
                tags "Amazon Web Services - DynamoDB"
            }
            ecr = container "ECR" "ltw-backend Docker images" {
                tags "Amazon Web Services - Elastic Container Registry"
            }
            logs = container "CloudWatch Logs" "Backend application logs" {
                tags "Amazon Web Services - CloudWatch"
            }
            pipeline = container "CodePipeline" "Source, Build, Deploy stages" {
                tags "Amazon Web Services - CodePipeline"
            }
            codebuild = container "CodeBuild" "Backend Docker build + Frontend npm build" {
                tags "Amazon Web Services - CodeBuild"
            }
        }

        user -> cdn "HTTPS"
        cdn -> s3 "Static files (OAC)"
        cdn -> alb "/graphql (HTTP origin)"
        alb -> backend "HTTP:8080 (health: /health)"
        backend -> nat "All outbound traffic"
        backend -> logs "Application logs"
        nat -> cognito "Auth API calls"
        nat -> users "DynamoDB API"
        nat -> orgs "DynamoDB API"
        nat -> projects "DynamoDB API"
        nat -> workpackages "DynamoDB API"
        nat -> deliverables "DynamoDB API"
        github -> pipeline "CodeStar Connection"
        pipeline -> codebuild "Triggers build"
        codebuild -> ecr "Push Docker image"
        codebuild -> s3 "Deploy frontend + invalidate"
        pipeline -> backend "ECS Deploy action"
    }

    views {
        systemContext ltw {
            include *
            autoLayout
        }

        container ltw {
            include *
            autoLayout
        }

        theme https://static.structurizr.com/themes/amazon-web-services-2023.01.31/theme.json
    }

}
