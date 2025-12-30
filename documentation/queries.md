# EU Project Management – GraphQL API Reference

This document describes **all available GraphQL operations** exposed by the EU Project Management backend.
It is intended for **API consumers, frontend developers, and automated agents**.

The API is **role-aware**, **pagination-enforced**, and **domain-driven**.

---

## Authentication

### Authenticate (Public)

Returns a JWT token.  
The token must be provided in the `Authorization: Bearer <token>` header for all other operations.

```graphql
mutation {
  authenticate(username: "admin", password: "password")
}
```

---

## Roles & Access Model

| Role     | Access Scope |
|---------|--------------|
| ADMIN   | Full system access |
| MANAGER | Projects they manage |
| PARTNER | Projects linked to their organization |

Access is **always enforced server-side**.

---

## Queries

### Projects

#### Get paginated projects
```graphql
query {
  projects(limit: 10, offset: 0) {
    totalCount
    hasNextPage
    items {
      id
      title
      acronym
      status
    }
  }
}
```

#### Get project by ID
```graphql
query {
  project(id: "project-id") {
    id
    title
    acronym
    status
  }
}
```

---

### Organizations

#### Get paginated organizations
```graphql
query {
  organizations(limit: 10, offset: 0) {
    totalCount
    hasNextPage
    items {
      id
      name
      country
      picCode
    }
  }
}
```

---

### Users (Admin only)

#### Get paginated users
```graphql
query {
  users(limit: 10, offset: 0) {
    totalCount
    items {
      id
      username
      role
    }
  }
}
```

#### Get user by ID
```graphql
query {
  user(id: "user-id") {
    id
    username
    role
    organization {
      id
      name
    }
  }
}
```

---

### Work Packages

#### Get work package by ID
```graphql
query {
  workPackage(id: "wp-id") {
    id
    title
    wpNumber
    projectId
  }
}
```

---

## Mutations

### Project Management

#### Create project (ADMIN, MANAGER)
```graphql
mutation {
  createProject(input: {
    title: "AI Platform"
    acronym: "AIP"
    status: ACTIVE
  }) {
    id
    title
  }
}
```

#### Delete project (ADMIN)
```graphql
mutation {
  removeProject(id: "project-id")
}
```

#### Assign manager to project (ADMIN)
```graphql
mutation {
  assignManagerToProject(
    projectId: "project-id",
    managerId: "user-id"
  ) {
    id
  }
}
```

#### Assign partner to project (ADMIN, MANAGER)
```graphql
mutation {
  assignPartnerToProject(
    projectId: "project-id",
    partnerId: "user-id"
  ) {
    id
  }
}
```

---

### Work Packages

#### Create work package (ADMIN, MANAGER)
```graphql
mutation {
  createWorkPackage(input: {
    title: "Research"
    wpNumber: 1
    projectId: "project-id"
    leadPartnerId: "user-id"
  }) {
    id
  }
}
```

#### Assign work package to project (ADMIN, MANAGER)
```graphql
mutation {
  assignWorkPackageToProject(
    projectId: "project-id",
    workPackageId: "wp-id"
  ) {
    id
  }
}
```

#### Delete work package (ADMIN)
```graphql
mutation {
  removeWorkPackage(id: "wp-id")
}
```

---

### Deliverables

#### Create deliverable (ADMIN, MANAGER)
```graphql
mutation {
  createDeliverable(
    wpId: "wp-id",
    input: {
      description: "Final report"
      dueDate: "2025-06-01"
      assignedTo: "user-id"
    }
  ) {
    id
    isSubmitted
  }
}
```

#### Submit deliverable
```graphql
mutation {
  submitDeliverable(id: "deliverable-id", status: true) {
    id
    isSubmitted
  }
}
```

---

### Organizations & Users

#### Create organization (ADMIN)
```graphql
mutation {
  createOrganization(input: {
    name: "Tech University"
    country: "DE"
    picCode: 123456
  }) {
    id
  }
}
```

#### Register user (ADMIN)
```graphql
mutation {
  registerUser(input: {
    username: "jdoe"
    email: "jdoe@example.com"
    password: "secret"
    role: PARTNER
    organizationId: "org-id"
  }) {
    id
  }
}
```

---

## Complex Nested Query Example

This query demonstrates **deep traversal**, **pagination**, and **resolver-based loading**.

```graphql
query {
  project(id: "project-id") {
    id
    title
    managers(limit: 5, offset: 0) {
      items {
        id
        username
      }
    }
    partners(limit: 5, offset: 0) {
      items {
        id
        username
        organization {
          name
          country
        }
      }
    }
    workPackages(limit: 3, offset: 0) {
      items {
        id
        title
        wpNumber
        leadPartner {
          username
        }
        deliverables(limit: 5, offset: 0) {
          items {
            id
            description
            dueDate
            isSubmitted
            assignedUser {
              username
              email
            }
          }
        }
      }
    }
  }
}
```

---

## Pagination Rules

- `limit` and `offset` are mandatory
- Server enforces maximum limits
- Nested collections are **always paginated**

---

## Security Notes

- All authorization is server-side
- Clients cannot bypass access rules via GraphQL selection
- Only permitted data is resolved

---

## Summary

This API supports:
- Secure project lifecycle management
- Role-based visibility
- Deep nested queries with safety guarantees
- Domain-driven GraphQL responses
