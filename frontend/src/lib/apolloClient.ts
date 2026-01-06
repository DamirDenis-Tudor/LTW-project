import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';

// HTTP Link - connection to GraphQL server
const httpLink = createHttpLink({
    uri: GRAPHQL_ENDPOINT,
});

// Auth Link - injects JWT token into headers
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('auth_token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Error response type for Apollo Client v4
interface ApolloErrorContext {
    graphQLErrors?: ReadonlyArray<{
        message: string;
        locations?: ReadonlyArray<{ line: number; column: number }>;
        path?: ReadonlyArray<string | number>;
        extensions?: Record<string, unknown>;
    }>;
    networkError?: Error | null;
}

// Error Link - global error handling
const errorLink = onError((errorContext) => {
    // Cast to our expected type since Apollo v4 types are incomplete
    const { graphQLErrors, networkError } = errorContext as unknown as ApolloErrorContext;

    if (graphQLErrors) {
        graphQLErrors.forEach((error) => {
            const { message, locations, path, extensions } = error;
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
            );

            // Handle authentication errors
            const code = extensions?.code as string | undefined;
            if (
                code === 'UNAUTHENTICATED' ||
                message.includes('Authentication required') ||
                message.includes('Invalid token')
            ) {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            }
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// Pagination merge function for offset-based pagination
interface PaginatedResult {
    items: unknown[];
    totalCount: number;
    hasNextPage: boolean;
    __typename: string;
}

function paginationMerge(
    existing: PaginatedResult | undefined,
    incoming: PaginatedResult,
    { args }: { args: Record<string, unknown> | null }
): PaginatedResult {
    const offset = (args?.offset as number) ?? 0;

    if (!existing || offset === 0) {
        return incoming;
    }

    // Merge items for infinite scroll scenarios
    const mergedItems = [...existing.items];
    incoming.items.forEach((item, i) => {
        mergedItems[offset + i] = item;
    });

    return {
        ...incoming,
        items: mergedItems,
    };
}

// Apollo Cache configuration with pagination policies
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                projects: {
                    keyArgs: false,
                    merge: paginationMerge,
                },
                users: {
                    keyArgs: false,
                    merge: paginationMerge,
                },
                organizations: {
                    keyArgs: false,
                    merge: paginationMerge,
                },
            },
        },
        ProjectResponse: {
            fields: {
                workPackages: {
                    keyArgs: false,
                    merge: paginationMerge,
                },
                partners: {
                    keyArgs: false,
                    merge: paginationMerge,
                },
                managers: {
                    keyArgs: false,
                    merge: paginationMerge,
                },
            },
        },
        WorkPackageResponse: {
            fields: {
                deliverables: {
                    keyArgs: false,
                    merge: paginationMerge,
                },
            },
        },
    },
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

export default apolloClient;
