# EU Project Management System - API

## 🏗 Architecture: Clean & Modular
This project follows **Clean Architecture** principles. It utilizes **Kotlin Delegation** and **KoinComponent Injection** to keep the GraphQL schema clean and the domain logic pure.

### 📂 Folder Structure & Layering
- **'domain/'**: Entities, Repository Interfaces, and Contracts.
- **'application/'**: Use Case implementations and **UseCaseModule.kt**.
- **'infrastructure/'**: Persistence (Repositories), GraphQL (Queries/Responses), and Layer DI modules.

---

## 🚀 Key Design Patterns

### 1. Contract Delegation ('by' keyword)
Wraps Domain Models in a Response DTO to prevent leaking core entities to the API.
```kotlin
class ProjectResponse(project: Project) : ProjectContract by project, KoinComponent
```

### 2. KoinComponent Injection
GraphQL Response DTOs pull dependencies lazily from the DI container using `by inject()`. This avoids "Constructor Hell" in the Query layer.

### 3. Smart Service Resolvers
Related data (like WorkPackages) are fetched via `suspend` functions in the Response class that call UseCases directly.

---

## 🛠 Dependency Injection (Koin)
Split into three modules:
1. **PersistenceModule**: Repositories.
2. **UseCaseModule**: Business logic.
3. **GraphQLModule**: API Entry points.

---

## 📊 GraphQL API Surface
- **Queries**: `projects`, `organizations`, `users`.
- **Pagination**: All lists return `items`, `totalCount`, and `hasNextPage`.

---

## 🧪 Development Guidelines
1. **Entity**: Model -> Contract -> Response.
2. **Relations**: Add `suspend` function in Response + `by inject()` UseCase.
3. **DI**: Register in the layer's specific `di/` folder.