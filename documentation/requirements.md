# EU Project Manager (Faculty Project)

---

## 1. Project Overview
This platform is a management tool for European consortium projects.  
It supports hierarchical project structures and provides a GraphQL interface to manage Projects, Work Packages, Organizations, Deliverables, and Users.  
Role-based access control ensures users can only view or modify data according to their role and assignments.

---

## 2. Entity Specifications

### A. Project
* **id** (ID!): Unique project identifier.
* **title** (String!): Full project name.
* **acronym** (String!): Short project name.
* **status** (Enum): `DRAFT`, `ACTIVE`, `COMPLETED`, `ARCHIVED`.
* **partners** (List[Organization]): Organizations involved in the project.
* **workPackages** (List[WorkPackage]): Associated work packages.
* **managers** (List[User]): Users assigned as project managers.

### B. Organization
* **id** (ID!): Unique identifier.
* **name** (String!): Legal name of the institution.
* **picCode** (Int!): EU Participant Identification Code.
* **country** (String!): Country of origin.
* **users** (List[User]): Users associated with the organization.

### C. WorkPackage
* **id** (ID!): Unique identifier.
* **wpNumber** (Int!): Sequence number of the work package.
* **title** (String!): Description of the work package.
* **leadPartner** (Organization!): Reference to the partner leading the work package.
* **deliverables** (List[Deliverable]): Associated tasks/deliverables.

### D. Deliverable
* **id** (ID!): Unique identifier.
* **description** (String!): Task details.
* **dueDate** (String!): Deadline date.
* **isSubmitted** (Boolean!): Submission status.
* **assignedTo** (User?): Optional user responsible for the deliverable.

### E. User
* **id** (ID!): Unique identifier.
* **username** (String!): Login name.
* **email** (String!): Contact email.
* **role** (Enum): `ADMIN`, `MANAGER`, `PARTNER`.
* **organizationId** (String?): Organization the user belongs to (only for PARTNER users).

---

## 3. GraphQL Operations

### I. Query Operations

#### Top-level Queries
* `getAllProjects(limit: Int, offset: Int)`: Paginated projects accessible to the authenticated user.
* `getProjectById(id: ID!)`: Retrieves project core info if the user has permission.
* `getTasksByStatus(isSubmitted: Boolean!)`: Returns deliverables accessible to the user, filtered by status.
* `getOrganizations(limit: Int, offset: Int)`: Paginated organizations.
* `getAllUsers(limit: Int, offset: Int)`: Paginated users (ADMIN only).
* `getUserById(id: ID!)`: Retrieve a user by ID (ADMIN only).

#### Nested Queries (Safe Pagination)
* `projectPartners(projectId: ID!, limit: Int, offset: Int)`: Paginated partner organizations linked to a project.
* `projectWorkPackages(projectId: ID!, limit: Int, offset: Int)`: Paginated work packages for a project.
* `projectManagers(projectId: ID!)`: Returns project managers (filtered by role).

---

### II. Mutation Operations

#### Authentication
* `login(username: String!, password: String!)`: Authenticate user.

#### User Management
* `createUser(input: UserInput!)`: Create a new user (ADMIN only).

#### Project Management
* `createProject(input: ProjectInput!)`: Create a project (MANAGER if assigned, or ADMIN).
* `deleteProject(id: ID!)`: Delete a project (ADMIN only).

#### Partner Management
* `addPartnerToProject(projectId: ID!, partnerId: ID!)`: Add a partner to a project (MANAGER if assigned, or ADMIN).
* `removePartner(id: ID!)`: Remove a partner (ADMIN only).

#### Work Package & Deliverable Management
* `createDeliverable(wpId: ID!, input: DeliverableInput!)`: Create deliverable (MANAGER if assigned, or ADMIN).
* `updateDeliverableStatus(id: ID!, status: Boolean!)`: Update deliverable status (assigned partner, MANAGER of project, or ADMIN).

---

## 4. Role-Based Access Policy

| Role      | Project Access                                           | Deliverable Access                                 | Partner/Organization Access                     |
|-----------|---------------------------------------------------------|--------------------------------------------------|------------------------------------------------|
| ADMIN     | Full access                                             | Full access                                      | Full access                                    |
| MANAGER   | Projects where `managers` includes user                | All deliverables in projects they manage        | Can add partners to projects they manage      |
| PARTNER   | Projects where `organizationId` of user is in `partners` | Only deliverables where `assignedTo` = user    | View organizations linked to their projects   |

**Notes:**
- Project managers are explicitly assigned via the `managers` field.
- Partner users belong to organizations; access is determined by organization participation.
- Deliverable access is determined by the `assignedTo` field.
- All paginated queries have **server-enforced max limits** to prevent overload.
- Nested lists (partners, work packages) should be fetched via separate queries with pagination to ensure performance and safe access.

---

## 5. Technical Implementation
* **Backend**: Kotlin + Ktor; GraphQL handled via KGraphQL/GraphQL-Kotlin.
* **Frontend**: React + Apollo Client.
* **Database**: In-memory mockup using Kotlin `MutableList`s.
* **Logic**:
    * Server-side validation for mandatory fields and dates.
    * Structured GraphQL error handling.
    * Enforcement of role-based access and project/organization assignments.
    * Pagination support for large entity queries with server-enforced limits.

---

## 6. Functional Requirements

### 6.1 Project Management
* Create, retrieve, update, and delete projects.
* Associate managers and partner organizations with projects.
* Access controlled by role and assignments.
* Support paginated retrieval for large project lists.

### 6.2 Organization Management
* Add, retrieve, remove, and paginate organizations.
* Access restricted by role and project assignment.

### 6.3 Work Package & Deliverable Management
* Create work packages and deliverables.
* Update deliverable status.
* Filter deliverables by status.
* Deliverables assigned to users enforce PARTNER access.
* Support paginated retrieval of work packages per project.

### 6.4 User Management
* Register and retrieve users (ADMIN only).
* Authenticate users with role-based access.
* Support paginated retrieval of users.

### 6.5 Data Retrieval & View Policies
* Projects: visible only to managers assigned or partners in participating organizations.
* Deliverables: visible only if assigned or part of a project user manages.
* Organizations: visible if linked to a project the user can access.
* Nested lists should be fetched via separate paginated queries to prevent over-fetching.

### 6.6 Validation & Error Handling
* Validate mandatory fields and date formats.
* Return structured GraphQL errors for invalid operations or unauthorized access.

---

This ensures a **secure, scalable, and fully functional platform** for managing European consortium projects, with role-based access, safe nested queries, and pagination.