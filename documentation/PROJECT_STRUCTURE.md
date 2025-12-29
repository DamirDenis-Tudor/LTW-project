# EU Project Management System - Architecture Documentation

## Overview
This is a Kotlin-based GraphQL API for managing EU projects, built using Clean Architecture principles with Ktor framework. The system manages organizations, users, projects, work packages, and deliverables with role-based access control.

## Architecture Pattern
The project follows **Clean Architecture** with clear separation of concerns:
- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and business rules
- **Infrastructure Layer**: External concerns (GraphQL, persistence, etc.)

## Project Structure

```
backend/
├── src/main/kotlin/
│   ├── Application.kt                 # Main application entry point
│   ├── application/                   # Application Layer
│   │   ├── context/
│   │   │   └── UserJwt.kt            # JWT user context
│   │   ├── input/                    # Input DTOs
│   │   │   ├── DeliverableInput.kt
│   │   │   ├── ProjectInput.kt
│   │   │   ├── UserInput.kt
│   │   │   └── WorkPackageInput.kt
│   │   └── usecase/                  # Business logic layer
│   │       ├── implementation/       # Use case implementations
│   │       │   ├── DeliverableUseCaseImpl.kt
│   │       │   ├── JwtUseCaseImpl.kt
│   │       │   ├── OrganizationUseCaseImpl.kt
│   │       │   ├── ProjectUseCaseImpl.kt
│   │       │   ├── UserUseCaseImpl.kt
│   │       │   └── WorkPackageUseCaseImpl.kt
│   │       └── interfaces/           # Use case contracts
│   │           ├── DeliverableUseCase.kt
│   │           ├── JwtUseCase.kt
│   │           ├── OrganizationUseCase.kt
│   │           ├── ProjectUseCase.kt
│   │           ├── UserUseCase.kt
│   │           └── WorkPackageUseCase.kt
│   ├── domain/                       # Domain Layer (Core Business Logic)
│   │   ├── model/                    # Domain entities
│   │   │   ├── contracts/            # Domain contracts for clean delegation
│   │   │   │   ├── DeliverableContract.kt
│   │   │   │   ├── OrganizationContract.kt
│   │   │   │   ├── ProjectContract.kt
│   │   │   │   ├── UserContract.kt
│   │   │   │   └── WorkPackageContract.kt
│   │   │   ├── Deliverable.kt        # Core domain models
│   │   │   ├── Organization.kt
│   │   │   ├── Project.kt
│   │   │   ├── User.kt
│   │   │   └── WorkPackage.kt
│   │   └── repository/               # Repository interfaces
│   │       ├── DeliverableRepository.kt
│   │       ├── OrganizationRepository.kt
│   │       ├── ProjectRepository.kt
│   │       ├── UserRepository.kt
│   │       └── WorkPackageRepository.kt
│   └── infrastructure/               # Infrastructure Layer
│       ├── graphql/                  # GraphQL API implementation
│       │   ├── context/              # GraphQL context and security
│       │   │   ├── CustomGraphQLContextFactory.kt
│       │   │   └── GraphQLContext.kt
│       │   ├── mutation/             # GraphQL mutations
│       │   │   ├── DeliverableMutation.kt
│       │   │   ├── ProjectMutation.kt
│       │   │   ├── UserMutation.kt
│       │   │   └── WorkPackageMutation.kt
│       │   ├── query/                # GraphQL queries
│       │   │   ├── OrganizationQuery.kt
│       │   │   ├── ProjectQuery.kt
│       │   │   ├── UserQuery.kt
│       │   │   └── WorkPackageQuery.kt
│       │   ├── response/             # GraphQL response types
│       │   │   ├── page/             # Pagination response types
│       │   │   │   ├── PaginatedDeliverables.kt
│       │   │   │   ├── PaginatedProjects.kt
│       │   │   │   ├── PaginatedUsers.kt
│       │   │   │   ├── PaginatedWorkPackageResponses.kt
│       │   │   │   └── PaginatedWorkPackages.kt
│       │   │   ├── DeliverableResponse.kt
│       │   │   ├── OrganizationResponse.kt
│       │   │   ├── ProjectResponse.kt
│       │   │   ├── UserResponse.kt
│       │   │   └── WorkPackageResponse.kt
│       │   └── GraphQLConfig.kt      # GraphQL configuration
│       └── persistence/              # Data persistence layer
│           ├── InMemoryDeliverableRepository.kt
│           ├── InMemoryOrganizationRepository.kt
│           ├── InMemoryProjectRepository.kt
│           ├── InMemoryUserRepository.kt
│           ├── InMemoryWorkPackageRepository.kt
│           └── SampleData.kt         # Sample data initialization
```

## Key Architectural Decisions

### 1. Domain Contracts Pattern
- **Purpose**: Enable clean delegation without exposing domain models to GraphQL schema
- **Implementation**: Each domain model has a corresponding contract interface
- **Benefit**: GraphQL response classes implement contracts via delegation, avoiding direct domain model exposure

### 2. Response Architecture
- **Pattern**: All GraphQL operations return response types, not domain models
- **Structure**: Response classes implement domain contracts and add GraphQL-specific functionality
- **Dependencies**: Response classes require all repositories to create nested response objects

### 3. Pagination Strategy
- **Repository Level**: Efficient pagination implemented at repository level with `limit` and `offset`
- **Counting**: Separate count methods for total record calculation
- **Performance**: Avoids loading all records into memory for filtering

### 4. Security Model
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (ADMIN, MANAGER, PARTNER)
- **Context**: GraphQL context carries user information for authorization checks

## Domain Models

### Core Entities
1. **Organization**: Top-level entity representing EU organizations
2. **User**: System users with roles (ADMIN, MANAGER, PARTNER)
3. **Project**: EU projects managed by organizations
4. **WorkPackage**: Project subdivisions with specific goals
5. **Deliverable**: Specific outputs within work packages

### Relationships
```
Organization (1) ──── (N) User
Organization (1) ──── (N) Project
Project (1) ──── (N) WorkPackage
WorkPackage (1) ──── (N) Deliverable
User (N) ──── (N) Project (managers/partners)
User (1) ──── (N) Deliverable (assigned)
```

## GraphQL Schema Design

### Queries
- **projects**: Paginated project listing with filtering
- **project(id)**: Single project retrieval
- **users**: Admin-only user listing
- **user(id)**: Admin-only user retrieval
- **organizations**: Organization listing
- **workPackage(id)**: Work package retrieval

### Mutations
- **Authentication**: `authenticate(username, password)`
- **User Management**: `registerUser(input)`
- **Project Management**: `createProject(input)`, `assignPartnerToProject(...)`, etc.
- **Work Package Management**: `createWorkPackage(input)`, `removeWorkPackage(id)`
- **Deliverable Management**: `createDeliverable(...)`, `submitDeliverable(...)`

### Response Types
All mutations and queries return response types that:
- Implement domain contracts via delegation
- Provide GraphQL-specific field resolvers
- Support nested object resolution with proper repository dependencies
- Include pagination metadata for collections

## Security & Authorization

### Role Hierarchy
1. **ADMIN**: Full system access
2. **MANAGER**: Project management within assigned projects
3. **PARTNER**: Limited access to assigned deliverables

### Access Control Patterns
- **Query-level**: Role validation in GraphQL context
- **Use Case-level**: Business rule enforcement
- **Resource-level**: Ownership and assignment checks

## Pagination Implementation

### Repository Methods
```kotlin
// Efficient pagination at repository level
fun findByOrganizationId(organizationId: String, limit: Int, offset: Int): List<T>
fun countByOrganizationId(organizationId: String): Int
```

### GraphQL Pagination
```kotlin
data class PaginatedResponse<T>(
    val items: List<T>,
    val totalCount: Int,
    val hasNextPage: Boolean
)
```

## Development Guidelines

### Adding New Features
1. **Domain First**: Define domain models and contracts
2. **Repository**: Add repository interface and implementation
3. **Use Case**: Implement business logic in use case layer
4. **GraphQL**: Create response types, queries/mutations
5. **Configuration**: Wire dependencies in GraphQL config

### Testing Strategy
- **Unit Tests**: Use case and domain logic testing
- **Integration Tests**: GraphQL endpoint testing
- **Repository Tests**: Data access layer validation

## Technology Stack
- **Framework**: Ktor (Kotlin web framework)
- **GraphQL**: GraphQL Kotlin (Expedia Group)
- **Authentication**: JWT tokens
- **Persistence**: In-memory repositories (easily replaceable)
- **Build Tool**: Gradle with Kotlin DSL

## Future Enhancements
- Database integration (PostgreSQL/MySQL)
- File upload support for deliverables
- Real-time notifications
- Advanced reporting and analytics
- Docker containerization
- API versioning strategy