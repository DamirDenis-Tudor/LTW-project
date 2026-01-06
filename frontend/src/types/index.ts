// User roles matching backend UserRole enum
export enum UserRole {
    Admin = 'ADMIN',
    Manager = 'MANAGER',
    Partner = 'PARTNER',
}

// Project status matching backend ProjectStatus enum
export enum ProjectStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED',
}

// JWT payload structure
export interface JwtPayload {
    sub: string; // user id
    username: string;
    role: UserRole;
    exp: number;
}

// User type
export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    organizationId?: string | null;
}

// Organization type
export interface Organization {
    id: string;
    name: string;
    picCode: number;
    country: string;
}

// Project type
export interface Project {
    id: string;
    title: string;
    acronym: string;
    status: ProjectStatus;
}

// Work Package type
export interface WorkPackage {
    id: string;
    wpNumber: number;
    title: string;
    projectId?: string;
}

// Deliverable type
export interface Deliverable {
    id: string;
    workPackageId: string;
    description: string;
    dueDate: string;
    isSubmitted: boolean;
    assignedTo?: string | null;
}

// Pagination types
export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    hasNextPage: boolean;
}

export type PaginatedProjects = PaginatedResponse<Project>;
export type PaginatedUsers = PaginatedResponse<User>;
export type PaginatedOrganizations = PaginatedResponse<Organization>;
export type PaginatedWorkPackages = PaginatedResponse<WorkPackage>;
export type PaginatedDeliverables = PaginatedResponse<Deliverable>;

// Input types for mutations
export interface ProjectInput {
    title: string;
    acronym: string;
    status: ProjectStatus;
}

export interface UserInput {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    organizationId?: string | null;
}

export interface OrganizationInput {
    name: string;
    picCode: number;
    country: string;
}

export interface WorkPackageInput {
    projectId: string;
    wpNumber: number;
    title: string;
    leadPartnerId: string;
}

export interface DeliverableInput {
    description: string;
    dueDate: string;
    assignedTo?: string | null;
}
