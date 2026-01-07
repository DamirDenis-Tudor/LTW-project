# EU Project Management System

A comprehensive project management system for EU research projects with role-based access control and GraphQL API.

## Project Structure

```
LTW-project/
├── backend/           # Kotlin backend with GraphQL API
├── frontend/          # Frontend application (to be implemented)
└── documentation/     # API documentation and requirements
```

## Backend

### Technology Stack
- **Kotlin** with **Ktor** framework
- **GraphQL** API with expediagroup/graphql-kotlin
- **Koin** for dependency injection
- **In-memory repositories** (development)

### Architecture

The backend follows **Clean Architecture** principles with clear separation of concerns:

```
src/main/kotlin/
├── application/           # Application layer
│   ├── common/           # Shared utilities (Page, UserJwt)
│   ├── exception/        # Custom exceptions
│   ├── input/           # Input contracts
│   └── usecase/         # Business logic
│       ├── interfaces/  # Use case contracts
│       └── implementation/ # Use case implementations
├── domain/              # Domain layer
│   ├── model/          # Domain entities and contracts
│   └── repository/     # Repository interfaces
├── infrastructure/     # Infrastructure layer
│   ├── graphql/       # GraphQL configuration and resolvers
│   │   ├── context/   # GraphQL context and auth
│   │   ├── dto/       # GraphQL DTOs (input/response/pagination)
│   │   ├── mutation/  # GraphQL mutations
│   │   └── query/     # GraphQL queries
│   └── persistence/   # Data persistence
│       └── repositories/ # In-memory repository implementations
└── Application.kt     # Main application entry point
```

### Key Features
- **Role-based access control** (ADMIN, MANAGER, PARTNER)
- **JWT authentication**
- **Paginated GraphQL queries**
- **Domain-driven design**
- **Clean separation of concerns**

### Domain Models
- **Project**: EU research projects with status tracking
- **Organization**: Partner institutions with PIC codes
- **User**: System users with role-based permissions
- **WorkPackage**: Project work packages with deliverables
- **Deliverable**: Work package deliverables with submission tracking

### Running the Backend

```bash
cd backend
./gradlew run
```

The GraphQL playground will be available at `http://localhost:8080/graphql`

## Frontend

The frontend is a modern React application built with TypeScript and Material UI, fully integrated with the GraphQL backend.

### Technology Stack
- **React 19**
- **TypeScript**
- **Apollo Client** for state management and GraphQL communication
- **Material UI (MUI)** for the design system
- **React Hook Form** & **Zod** for form validation
- **GraphQL Codegen** for type-safe API interactions

### Key Features
- **Modern Dashboard**: High-quality UI with glassmorphism and smooth transitions
- **Project Management**: Full CRUD operations for projects
- **Work Package & Deliverable Tracking**: Interactive lists with status filtering and real-time updates
- **Role-Based UI**: Conditional rendering of features based on user roles (Admin, Manager, Partner)
- **Pagination & Caching**: Efficient data loading using Apollo Client merge policies
- **Responsive Design**: Fully responsive layout using MUI Grid v2

### Running the Frontend

```bash
cd frontend
npm install
npm run codegen
npm start
```

## Documentation

- [GraphQL API Reference](documentation/queries.md) - Complete API documentation
- [Requirements](documentation/requirements.md) - Project requirements and specifications

## Development

### Prerequisites
- JDK 11 or higher
- Gradle (included via wrapper)

### Getting Started

1. Clone the repository
2. Navigate to backend directory: `cd backend`
3. Run the application: `./gradlew run`
4. Access GraphQL playground at `http://localhost:8080/graphql`

### Authentication

Use the authenticate mutation to get a JWT token:

```graphql
mutation {
  authenticate(username: "admin", password: "password")
}
```

Include the token in subsequent requests:
```
Authorization: Bearer <your-jwt-token>
```