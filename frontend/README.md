# EU Project Management - Frontend
 
A modern, type-safe React application for managing EU research projects.
 
## Tech Stack
 
- **Core**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Client**: [Apollo Client](https://www.apollographql.com/docs/react/)
- **UI Framework**: [Material UI (MUI)](https://mui.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Styling**: Vanilla CSS with MUI's theme system
 
## Project Structure
 
- `src/features/`: Domain-specific components and logic (auth, projects)
- `src/graphql/`: GraphQL queries and mutations (.graphql files)
- `src/gql/`: Generated TypeScript types from GraphQL schema
- `src/lib/`: Library configurations (Apollo Client setup)
- `src/hooks/`: Custom React hooks
- `src/components/`: Shared UI components
 
## Setup & Development
 
### Prerequisites
- Node.js (v18+)
- Backend running at `http://localhost:8080/graphql`
 
### Installation
 
```bash
npm install
```
 
### GraphQL Code Generation
 
We use GraphQL Codegen to generate TypeScript types from the backend schema and our `.graphql` files. This ensures full type safety when interacting with the API.
 
```bash
npm run codegen
```
 
> [!IMPORTANT]
> Always run `npm run codegen` after making changes to `.graphql` files or when the backend schema changes.
 
### Running the application
 
```bash
npm start
```
 
## Architecture Decisions
 
### Pagination & Caching
The application uses Apollo Client's `keyArgs` configuration in `apolloClient.ts` to handle offset-based pagination. This ensures that switching pages correctly fetches new data while maintaining a clean cache.
 
### Role-Based Access Control
UI elements are protected using a centralized `AuthContext`. Components check the current user's role (`ADMIN`, `MANAGER`, `PARTNER`) to determine visibility of edit buttons, navigation items, and specific project sections.
 
### Form Validation
All forms use `zod` schemas for robust client-side validation, integrated seamlessly with `react-hook-form`.
