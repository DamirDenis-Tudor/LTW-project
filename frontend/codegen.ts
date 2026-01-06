import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://localhost:8080/sdl',
    documents: ['src/graphql/**/*.graphql'],
    generates: {
        './src/graphql/generated/types.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                withHooks: true,
                withHOC: false,
                withComponent: false,
                strictScalars: true,
                scalars: {
                    ID: 'string',
                },
                enumsAsTypes: false,
                maybeValue: 'T | null',
                avoidOptionals: {
                    field: true,
                    inputValue: false,
                    object: true,
                    defaultValue: false,
                },
            },
        },
    },
    hooks: {
        afterAllFileWrite: ['prettier --write'],
    },
};

export default config;
