import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { NotificationService } from '../utils/notificationService';

const GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql';

// HTTP Link - connection to GraphQL server
const httpLink = createHttpLink({
    uri: GRAPHQL_ENDPOINT,
});

// Auth Link - injects JWT token into headers
const authLink = setContext((_, { headers }: any) => {
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
                // Don't show toast for auth errors to avoid spamming on session expire, just redirect
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            } else {
                NotificationService.error(message || 'An GraphQL error occurred');
            }
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
        NotificationService.error(`Network error: ${networkError.message}`);
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
                    keyArgs: ["limit", "offset"],
                    merge: paginationMerge,
                },
                users: {
                    keyArgs: ["limit", "offset"],
                    merge: paginationMerge,
                },
                organizations: {
                    keyArgs: ["limit", "offset"],
                    merge: paginationMerge,
                },
            },
        },
        ProjectResponse: {
            fields: {
                workPackages: {
                    keyArgs: ["limit", "offset"],
                    merge: paginationMerge,
                },
                partners: {
                    keyArgs: ["limit", "offset"],
                    merge: paginationMerge,
                },
                managers: {
                    keyArgs: ["limit", "offset"],
                    merge: paginationMerge,
                },
            },
        },
        WorkPackageResponse: {
            fields: {
                deliverables: {
                    keyArgs: ["limit", "offset", "isSubmitted"],
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
