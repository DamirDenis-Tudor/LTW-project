/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type DeliverableContract = {
  assignedTo?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  dueDate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isSubmitted: Scalars['Boolean']['output'];
  workPackageId: Scalars['String']['output'];
};

/** Input for creating or updating a deliverable */
export type DeliverableInput = {
  /** ID of the user assigned to this deliverable */
  assignedTo?: InputMaybe<Scalars['String']['input']>;
  /** Description of the deliverable */
  description: Scalars['String']['input'];
  /** Due date for the deliverable */
  dueDate: Scalars['String']['input'];
};

/** Deliverable response with additional GraphQL fields */
export type DeliverableResponse = DeliverableContract & {
  __typename?: 'DeliverableResponse';
  /** ID of the user assigned to this deliverable */
  assignedTo?: Maybe<Scalars['String']['output']>;
  /** Get the user assigned to this deliverable (Admin and Manager only) */
  assignedUser?: Maybe<UserResponse>;
  /** Description of the deliverable */
  description: Scalars['String']['output'];
  /** Due date for the deliverable */
  dueDate: Scalars['String']['output'];
  /** Unique identifier for the deliverable */
  id: Scalars['String']['output'];
  /** Whether the deliverable has been submitted */
  isSubmitted: Scalars['Boolean']['output'];
  /** Get the work package this deliverable belongs to */
  workPackage?: Maybe<WorkPackageResponse>;
  /** ID of the work package this deliverable belongs to */
  workPackageId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Assign a manager to a project (Admin only) */
  assignManagerToProject: ProjectResponse;
  /** Assign a partner to a project (Admin and Manager only) */
  assignPartnerToProject: ProjectResponse;
  /** Assign a work package to a project (Admin and Manager only) */
  assignWorkPackageToProject: ProjectResponse;
  /** Authenticate user with username and password, returns JWT token */
  authenticate: Scalars['String']['output'];
  /** Create a new deliverable for a work package (Admin and Manager only) */
  createDeliverable: DeliverableResponse;
  /** Create a new organization (Admin only) */
  createOrganization: OrganizationResponse;
  /** Create a new project (Admin and Manager only) */
  createProject: ProjectResponse;
  /** Create a new work package (Admin and Manager only) */
  createWorkPackage: WorkPackageResponse;
  /** Register a new user (Admin only) */
  registerUser: UserResponse;
  /** Delete a project (Admin only) */
  removeProject: Scalars['Boolean']['output'];
  /** Delete a work package (Admin only) */
  removeWorkPackage: Scalars['Boolean']['output'];
  /** Update deliverable submission status */
  submitDeliverable: DeliverableResponse;
};


export type MutationAssignManagerToProjectArgs = {
  managerId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type MutationAssignPartnerToProjectArgs = {
  partnerId: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
};


export type MutationAssignWorkPackageToProjectArgs = {
  projectId: Scalars['String']['input'];
  workPackageId: Scalars['String']['input'];
};


export type MutationAuthenticateArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationCreateDeliverableArgs = {
  input: DeliverableInput;
  wpId: Scalars['String']['input'];
};


export type MutationCreateOrganizationArgs = {
  input: OrganizationInput;
};


export type MutationCreateProjectArgs = {
  input: ProjectInput;
};


export type MutationCreateWorkPackageArgs = {
  input: WorkPackageInput;
};


export type MutationRegisterUserArgs = {
  input: UserInput;
};


export type MutationRemoveProjectArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveWorkPackageArgs = {
  id: Scalars['String']['input'];
};


export type MutationSubmitDeliverableArgs = {
  id: Scalars['String']['input'];
  status: Scalars['Boolean']['input'];
};

export type OrganizationContract = {
  country: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  picCode: Scalars['Int']['output'];
};

/** Input for creating or updating an organization */
export type OrganizationInput = {
  /** Country where the organization is located */
  country: Scalars['String']['input'];
  /** Name of the organization */
  name: Scalars['String']['input'];
  /** PIC code of the organization */
  picCode: Scalars['Int']['input'];
};

/** Organization response with additional GraphQL fields */
export type OrganizationResponse = OrganizationContract & {
  __typename?: 'OrganizationResponse';
  /** Country where the organization is located */
  country: Scalars['String']['output'];
  /** Unique identifier for the organization */
  id: Scalars['String']['output'];
  /** Name of the organization */
  name: Scalars['String']['output'];
  /** PIC code of the organization */
  picCode: Scalars['Int']['output'];
  /** Get all users belonging to this organization (Admin and Manager only) */
  users: PaginatedUsers;
};


/** Organization response with additional GraphQL fields */
export type OrganizationResponseUsersArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

/** Paginated deliverables response */
export type PaginatedDeliverables = {
  __typename?: 'PaginatedDeliverables';
  /** Whether there are more deliverables available */
  hasNextPage: Scalars['Boolean']['output'];
  /** List of deliverables in current page */
  items: Array<DeliverableResponse>;
  /** Total number of deliverables available */
  totalCount: Scalars['Int']['output'];
};

/** Paginated list of organizations */
export type PaginatedOrganizations = {
  __typename?: 'PaginatedOrganizations';
  /** Whether there are more organizations available */
  hasNextPage: Scalars['Boolean']['output'];
  /** List of organizations in current page */
  items: Array<OrganizationResponse>;
  /** Total number of organizations available */
  totalCount: Scalars['Int']['output'];
};

/** Paginated projects response */
export type PaginatedProjects = {
  __typename?: 'PaginatedProjects';
  /** Whether there are more projects available */
  hasNextPage: Scalars['Boolean']['output'];
  /** List of projects in current page */
  items: Array<ProjectResponse>;
  /** Total number of projects available */
  totalCount: Scalars['Int']['output'];
};

/** Paginated users response */
export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  /** Whether there are more users available */
  hasNextPage: Scalars['Boolean']['output'];
  /** List of users in current page */
  items: Array<UserResponse>;
  /** Total number of users available */
  totalCount: Scalars['Int']['output'];
};

/** Paginated work packages response */
export type PaginatedWorkPackages = {
  __typename?: 'PaginatedWorkPackages';
  /** Whether there are more work packages available */
  hasNextPage: Scalars['Boolean']['output'];
  /** List of work packages in current page */
  items: Array<WorkPackageResponse>;
  /** Total number of work packages available */
  totalCount: Scalars['Int']['output'];
};

export type ProjectContract = {
  acronym: Scalars['String']['output'];
  id: Scalars['String']['output'];
  status: ProjectStatus;
  title: Scalars['String']['output'];
};

/** Input for creating or updating a project */
export type ProjectInput = {
  /** Acronym of the project */
  acronym: Scalars['String']['input'];
  /** Status of the project */
  status: ProjectStatus;
  /** Title of the project */
  title: Scalars['String']['input'];
};

/** Project response with additional GraphQL fields */
export type ProjectResponse = ProjectContract & {
  __typename?: 'ProjectResponse';
  /** Acronym of the project */
  acronym: Scalars['String']['output'];
  /** Unique identifier for the project */
  id: Scalars['String']['output'];
  /** Get paginated manager users for this project (Admin only) */
  managers: PaginatedUsers;
  /** Get paginated partner users for this project */
  partners: PaginatedUsers;
  /** Current status of the project */
  status: ProjectStatus;
  /** Title of the project */
  title: Scalars['String']['output'];
  /** Get paginated work packages for this project */
  workPackages: PaginatedWorkPackages;
};


/** Project response with additional GraphQL fields */
export type ProjectResponseManagersArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


/** Project response with additional GraphQL fields */
export type ProjectResponsePartnersArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


/** Project response with additional GraphQL fields */
export type ProjectResponseWorkPackagesArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export enum ProjectStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT'
}

export type Query = {
  __typename?: 'Query';
  organizations: PaginatedOrganizations;
  /** Get a specific project by ID if user has access */
  project: ProjectResponse;
  /** Get paginated list of projects based on user role and permissions */
  projects: PaginatedProjects;
  /** Get a specific user by ID (Admin only) */
  user?: Maybe<UserResponse>;
  /** Get paginated list of all users (Admin only) */
  users: PaginatedUsers;
  /** Get a specific work package by ID if user has access */
  workPackage?: Maybe<WorkPackageResponse>;
};


export type QueryOrganizationsArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryProjectArgs = {
  id: Scalars['String']['input'];
};


export type QueryProjectsArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryWorkPackageArgs = {
  id: Scalars['String']['input'];
};

export type UserContract = {
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  username: Scalars['String']['output'];
};

/** Input for creating or updating a user */
export type UserInput = {
  /** Email address of the user */
  email: Scalars['String']['input'];
  /** ID of the organization this user belongs to */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Password for the user */
  password: Scalars['String']['input'];
  /** Role of the user in the system */
  role: UserRole;
  /** Username for the user */
  username: Scalars['String']['input'];
};

/** User response with additional GraphQL fields */
export type UserResponse = UserContract & {
  __typename?: 'UserResponse';
  /** Email address of the user */
  email: Scalars['String']['output'];
  /** Unique identifier for the user */
  id: Scalars['String']['output'];
  /** Get projects where this user is a manager */
  managedProjects: PaginatedProjects;
  /** Get the organization this user belongs to */
  organization?: Maybe<OrganizationResponse>;
  /** ID of the organization this user belongs to */
  organizationId?: Maybe<Scalars['String']['output']>;
  /** Get projects where this user is a partner */
  partnerProjects: PaginatedProjects;
  /** Role of the user in the system */
  role: UserRole;
  /** Username of the user */
  username: Scalars['String']['output'];
};


/** User response with additional GraphQL fields */
export type UserResponseManagedProjectsArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


/** User response with additional GraphQL fields */
export type UserResponsePartnerProjectsArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Manager = 'MANAGER',
  Partner = 'PARTNER'
}

export type WorkPackageContract = {
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  wpNumber: Scalars['Int']['output'];
};

/** Input for creating or updating a work package */
export type WorkPackageInput = {
  /** ID of the lead partner for this work package */
  leadPartnerId: Scalars['String']['input'];
  /** ID of the project this work package belongs to */
  projectId: Scalars['String']['input'];
  /** Title of the work package */
  title: Scalars['String']['input'];
  /** Work package number */
  wpNumber: Scalars['Int']['input'];
};

/** Work package response with additional GraphQL fields */
export type WorkPackageResponse = WorkPackageContract & {
  __typename?: 'WorkPackageResponse';
  /** Get paginated deliverables for this work package (Authenticated users only) */
  deliverables: PaginatedDeliverables;
  /** Unique identifier for the work package */
  id: Scalars['String']['output'];
  /** Get the lead partner user for this work package */
  leadPartner?: Maybe<UserResponse>;
  /** Get the project this work package belongs to */
  project?: Maybe<ProjectResponse>;
  /** Title of the work package */
  title: Scalars['String']['output'];
  /** Work package number */
  wpNumber: Scalars['Int']['output'];
};


/** Work package response with additional GraphQL fields */
export type WorkPackageResponseDeliverablesArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type AuthenticateMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type AuthenticateMutation = { __typename?: 'Mutation', authenticate: string };

export type CreateDeliverableMutationVariables = Exact<{
  wpId: Scalars['String']['input'];
  input: DeliverableInput;
}>;


export type CreateDeliverableMutation = { __typename?: 'Mutation', createDeliverable: { __typename?: 'DeliverableResponse', id: string, description: string, dueDate: string, isSubmitted: boolean, assignedTo?: string | null } };

export type SubmitDeliverableMutationVariables = Exact<{
  id: Scalars['String']['input'];
  status: Scalars['Boolean']['input'];
}>;


export type SubmitDeliverableMutation = { __typename?: 'Mutation', submitDeliverable: { __typename?: 'DeliverableResponse', id: string, isSubmitted: boolean } };

export type CreateOrganizationMutationVariables = Exact<{
  input: OrganizationInput;
}>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization: { __typename?: 'OrganizationResponse', id: string, name: string, country: string, picCode: number } };

export type CreateProjectMutationVariables = Exact<{
  input: ProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'ProjectResponse', id: string, title: string, acronym: string, status: ProjectStatus } };

export type RemoveProjectMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveProjectMutation = { __typename?: 'Mutation', removeProject: boolean };

export type AssignPartnerToProjectMutationVariables = Exact<{
  projectId: Scalars['String']['input'];
  partnerId: Scalars['String']['input'];
}>;


export type AssignPartnerToProjectMutation = { __typename?: 'Mutation', assignPartnerToProject: { __typename?: 'ProjectResponse', id: string, title: string } };

export type AssignManagerToProjectMutationVariables = Exact<{
  projectId: Scalars['String']['input'];
  managerId: Scalars['String']['input'];
}>;


export type AssignManagerToProjectMutation = { __typename?: 'Mutation', assignManagerToProject: { __typename?: 'ProjectResponse', id: string, title: string } };

export type AssignWorkPackageToProjectMutationVariables = Exact<{
  projectId: Scalars['String']['input'];
  workPackageId: Scalars['String']['input'];
}>;


export type AssignWorkPackageToProjectMutation = { __typename?: 'Mutation', assignWorkPackageToProject: { __typename?: 'ProjectResponse', id: string, title: string } };

export type RegisterUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserResponse', id: string, username: string, email: string, role: UserRole, organizationId?: string | null } };

export type CreateWorkPackageMutationVariables = Exact<{
  input: WorkPackageInput;
}>;


export type CreateWorkPackageMutation = { __typename?: 'Mutation', createWorkPackage: { __typename?: 'WorkPackageResponse', id: string, title: string, wpNumber: number } };

export type RemoveWorkPackageMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveWorkPackageMutation = { __typename?: 'Mutation', removeWorkPackage: boolean };

export type GetOrganizationsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetOrganizationsQuery = { __typename?: 'Query', organizations: { __typename?: 'PaginatedOrganizations', totalCount: number, hasNextPage: boolean, items: Array<{ __typename?: 'OrganizationResponse', id: string, name: string, country: string, picCode: number }> } };

export type GetProjectsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetProjectsQuery = { __typename?: 'Query', projects: { __typename?: 'PaginatedProjects', totalCount: number, hasNextPage: boolean, items: Array<{ __typename?: 'ProjectResponse', id: string, title: string, acronym: string, status: ProjectStatus }> } };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project: { __typename?: 'ProjectResponse', id: string, title: string, acronym: string, status: ProjectStatus } };

export type GetProjectWithManagersQueryVariables = Exact<{
  id: Scalars['String']['input'];
  managersLimit: Scalars['Int']['input'];
  managersOffset: Scalars['Int']['input'];
}>;


export type GetProjectWithManagersQuery = { __typename?: 'Query', project: { __typename?: 'ProjectResponse', id: string, title: string, acronym: string, status: ProjectStatus, managers: { __typename?: 'PaginatedUsers', totalCount: number, hasNextPage: boolean, items: Array<{ __typename?: 'UserResponse', id: string, username: string, email: string }> } } };

export type GetProjectWithPartnersQueryVariables = Exact<{
  id: Scalars['String']['input'];
  partnersLimit: Scalars['Int']['input'];
  partnersOffset: Scalars['Int']['input'];
}>;


export type GetProjectWithPartnersQuery = { __typename?: 'Query', project: { __typename?: 'ProjectResponse', id: string, title: string, acronym: string, status: ProjectStatus, partners: { __typename?: 'PaginatedUsers', totalCount: number, hasNextPage: boolean, items: Array<{ __typename?: 'UserResponse', id: string, username: string, email: string, organization?: { __typename?: 'OrganizationResponse', id: string, name: string, country: string } | null }> } } };

export type GetProjectWithWorkPackagesQueryVariables = Exact<{
  id: Scalars['String']['input'];
  wpLimit: Scalars['Int']['input'];
  wpOffset: Scalars['Int']['input'];
}>;


export type GetProjectWithWorkPackagesQuery = { __typename?: 'Query', project: { __typename?: 'ProjectResponse', id: string, title: string, acronym: string, status: ProjectStatus, workPackages: { __typename?: 'PaginatedWorkPackages', totalCount: number, hasNextPage: boolean, items: Array<{ __typename?: 'WorkPackageResponse', id: string, wpNumber: number, title: string, leadPartner?: { __typename?: 'UserResponse', id: string, username: string } | null }> } } };

export type GetProjectTeamQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProjectTeamQuery = { __typename?: 'Query', project: { __typename?: 'ProjectResponse', id: string, managers: { __typename?: 'PaginatedUsers', items: Array<{ __typename?: 'UserResponse', id: string, username: string, email: string }> }, partners: { __typename?: 'PaginatedUsers', items: Array<{ __typename?: 'UserResponse', id: string, username: string, email: string, organization?: { __typename?: 'OrganizationResponse', id: string, name: string } | null }> } } };

export type GetUsersQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetUsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedUsers', totalCount: number, hasNextPage: boolean, items: Array<{ __typename?: 'UserResponse', id: string, username: string, email: string, role: UserRole, organizationId?: string | null }> } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'UserResponse', id: string, username: string, email: string, role: UserRole, organizationId?: string | null, organization?: { __typename?: 'OrganizationResponse', id: string, name: string, country: string } | null } | null };

export type GetWorkPackageQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetWorkPackageQuery = { __typename?: 'Query', workPackage?: { __typename?: 'WorkPackageResponse', id: string, title: string, wpNumber: number } | null };

export type GetWorkPackageWithDeliverablesQueryVariables = Exact<{
  id: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetWorkPackageWithDeliverablesQuery = { __typename?: 'Query', workPackage?: { __typename?: 'WorkPackageResponse', id: string, title: string, wpNumber: number, deliverables: { __typename?: 'PaginatedDeliverables', totalCount: number, hasNextPage: boolean, items: Array<{ __typename?: 'DeliverableResponse', id: string, description: string, dueDate: string, isSubmitted: boolean, assignedTo?: string | null, assignedUser?: { __typename?: 'UserResponse', id: string, username: string, email: string } | null }> }, project?: { __typename?: 'ProjectResponse', id: string, title: string, partners: { __typename?: 'PaginatedUsers', items: Array<{ __typename?: 'UserResponse', id: string, username: string }> } } | null } | null };


export const AuthenticateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Authenticate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;
export const CreateDeliverableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDeliverable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wpId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeliverableInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDeliverable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wpId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wpId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"isSubmitted"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}}]}}]}}]} as unknown as DocumentNode<CreateDeliverableMutation, CreateDeliverableMutationVariables>;
export const SubmitDeliverableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitDeliverable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitDeliverable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isSubmitted"}}]}}]}}]} as unknown as DocumentNode<SubmitDeliverableMutation, SubmitDeliverableMutationVariables>;
export const CreateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"picCode"}}]}}]}}]} as unknown as DocumentNode<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const CreateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CreateProjectMutation, CreateProjectMutationVariables>;
export const RemoveProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveProjectMutation, RemoveProjectMutationVariables>;
export const AssignPartnerToProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignPartnerToProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partnerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignPartnerToProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"partnerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partnerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<AssignPartnerToProjectMutation, AssignPartnerToProjectMutationVariables>;
export const AssignManagerToProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignManagerToProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"managerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignManagerToProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"managerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"managerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<AssignManagerToProjectMutation, AssignManagerToProjectMutationVariables>;
export const AssignWorkPackageToProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignWorkPackageToProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workPackageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignWorkPackageToProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workPackageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workPackageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<AssignWorkPackageToProjectMutation, AssignWorkPackageToProjectMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const CreateWorkPackageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkPackage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkPackageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkPackage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"wpNumber"}}]}}]}}]} as unknown as DocumentNode<CreateWorkPackageMutation, CreateWorkPackageMutationVariables>;
export const RemoveWorkPackageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveWorkPackage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeWorkPackage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveWorkPackageMutation, RemoveWorkPackageMutationVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"picCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetProjectQuery, GetProjectQueryVariables>;
export const GetProjectWithManagersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectWithManagers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"managersLimit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"managersOffset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"managers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"managersLimit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"managersOffset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectWithManagersQuery, GetProjectWithManagersQueryVariables>;
export const GetProjectWithPartnersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectWithPartners"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partnersLimit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partnersOffset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"partners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partnersLimit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partnersOffset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectWithPartnersQuery, GetProjectWithPartnersQueryVariables>;
export const GetProjectWithWorkPackagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectWithWorkPackages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wpLimit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wpOffset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"acronym"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"workPackages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wpLimit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wpOffset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wpNumber"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"leadPartner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectWithWorkPackagesQuery, GetProjectWithWorkPackagesQueryVariables>;
export const GetProjectTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"managers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"partners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectTeamQuery, GetProjectTeamQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetWorkPackageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkPackage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workPackage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"wpNumber"}}]}}]}}]} as unknown as DocumentNode<GetWorkPackageQuery, GetWorkPackageQueryVariables>;
export const GetWorkPackageWithDeliverablesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkPackageWithDeliverables"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workPackage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"wpNumber"}},{"kind":"Field","name":{"kind":"Name","value":"deliverables"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"isSubmitted"}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"}},{"kind":"Field","name":{"kind":"Name","value":"assignedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"partners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetWorkPackageWithDeliverablesQuery, GetWorkPackageWithDeliverablesQueryVariables>;