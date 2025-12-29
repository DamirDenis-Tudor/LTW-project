# EU Project Manager - AI Guidelines

## 1. Overview

This project is a **backend system for European consortium project management**.  
It provides **GraphQL APIs** with **role-based access control** and **hierarchical project structures**.

The AI agent should use these guidelines to:
- Generate or update code following **DDD principles**.
- Ensure **GraphQL queries and mutations** respect **pagination and access control**.
- Suggest improvements or code snippets consistent with the project architecture.

References:
- [GraphQL-Kotlin Ktor Overview](https://opensource.expediagroup.com/graphql-kotlin/docs/server/ktor-server/ktor-overview)
- [GraphQL-Kotlin Ktor Context](https://opensource.expediagroup.com/graphql-kotlin/docs/server/ktor-server/ktor-graphql-context)
- [GraphQL-Kotlin Ktor Schema](https://opensource.expediagroup.com/graphql-kotlin/docs/server/ktor-server/ktor-schema)

---

## 2. Project Structure

```
backend/src/main/kotlin/
├── domain/
│   ├── model/                # Entities & Value Objects
│   ├── repository/           # Repository interfaces
│   └── service/              # Domain services
├── infrastructure/
│   ├── persistence/          # Repository implementations
│   ├── graphql/              # Queries, mutations, schema definitions
│   └── auth/                 # JWT & authentication services
└── Application.kt            # Main Ktor application setup
```

---

## 3. Code Guidelines for AI Agent

### 3.1 Conventions
- **Line length:** 120 characters maximum.
- **File organization:** Keep enums (each enum with its file), data classes, and input types in separate files.
- **Method naming:** Use descriptive, camelCase names.
- **Domain first:** Business logic belongs in domain entities or domain services, not in GraphQL resolvers.

### 3.2 Authentication & Access
- Current authenticated user is always available via **GraphQL context**.
- Use `validateRoles(allowedRoles) { user -> ... }` to enforce **role-based access**.
- Roles:
    - `ADMIN` → Full access.
    - `MANAGER` → Projects they manage.
    - `PARTNER` → Projects linked to their organization; can only see assigned deliverables.

### 3.3 Pagination
- All list-returning queries must support `limit` and `offset`.
- **Server-enforced max limit** must always be applied.
- Nested lists (partners, work packages, deliverables) should be **paginated** or retrieved via separate queries.

---

## 4. GraphQL Guidelines

### 4.1 Query Conventions
- Return **domain entities directly**, no DTOs required.
- Example:
```graphql
query {
  getProjectById(id: "123") {
    id
    title
    partners(limit: 10, offset: 0) {
      id
      name
    }
    workPackages(limit: 5, offset: 0) {
      id
      title
    }
  }
}
```
- Only return data allowed by the **role-based access policy**.

### 4.2 Mutation Conventions
- Always validate **roles** and **input data**.
- Example:
```kotlin
suspend fun createProject(input: ProjectInput, currentUser: User): Project =
    validateRoles(listOf(UserRole.ADMIN, UserRole.MANAGER)) { user ->
        Project.create(input, user.id)
            .also { projectRepo.save(it) }
    }
```
- Mutations must call **domain methods**, not modify collections directly.

### 4.3 Ktor GraphQL Module Example
```kotlin
@ContactDirective(
    name = "EU Project Team",
    url = "https://myteam.slack.com/archives/teams-chat-room-url",
    description = "Send urgent issues to [#oncall](https://myteam.slack.com/archives/oncall)."
)
@GraphQLDescription("GraphQL schema for EU Project Management")
class ProjectSchema : Schema

fun Application.graphQLModule(projectRepo: ProjectRepository) {
    install(GraphQL) {
        schema {
            packages = listOf("com.example")
            queries = listOf(ProjectQuery(projectRepo))
            mutations = listOf(ProjectMutation(projectRepo))
            schemaObject = ProjectSchema()
        }
    }
    routing {
        graphQLPostRoute()
    }
}
```

---

## 5. Domain-Driven Design (DDD) Principles

- **Domain Layer:** Entities, value objects, domain services, repository interfaces.
- **Infrastructure Layer:** Repositories, GraphQL resolvers, JWT authentication.
- **Aggregates:**
    - `Project` → contains WorkPackages, Partners, Managers.
    - `WorkPackage` → contains Deliverables.
    - `Organization` and `User` → separate aggregates.

---

## 6. Error Handling

- Return **structured GraphQL errors** for:
    - Invalid input
    - Unauthorized access
    - Not found entities
- Use Ktor `StatusPages` or GraphQL-Kotlin’s built-in error handling.

---

## 7. AI Agent Usage Guidelines

When generating code or assisting developers, the AI should:
1. Follow **DDD and layered architecture**.
2. Respect **role-based access** in resolvers.
3. Always enforce **pagination limits** for lists.
4. Keep **business logic inside domain entities/services**.
5. Return **domain objects directly**, no DTOs needed.
6. Avoid exposing sensitive data (like internal IDs) directly to clients.

---

This README ensures the AI agent **writes consistent, safe, and maintainable code** aligned with the EU Project Manager backend architecture, GraphQL-Kotlin best practices, and Ktor integration.

