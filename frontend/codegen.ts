import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "http://localhost:8080/graphql",
    documents: ["src/**/*.{ts,tsx,graphql}"],
    generates: {
        "./src/gql/": {
            preset: "client",
            presetConfig: {
                fragmentMasking: false,
            },
        },
    },
};
export default config;
