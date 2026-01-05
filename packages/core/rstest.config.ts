import { defineConfig } from "@rstest/core";

export default defineConfig({
    projects: [
        /* Noram unit tests node-swc runs */
        {
            name: "unit tests",
            globals: true,
            include: [
                "**/__tests__/**/*.[jt]s?(x)",
                "**/__tests__/**/*.m[jt]s?(x)",
                "**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)",
            ],
        },
        /* Integration tests requires a fixture setup to run tests, like plugins */
        !!process.env.DISABLE_PLUGIN_E2E_TESTS
            ? undefined
            : {
                  name: "e2e tests",
                  globals: true,
                  include: ["**/e2e/**/?(*.)+(spec|test).[jt]s?(x)"],
              },
    ].filter((x): x is NonNullable<typeof x> => Boolean(x)),
});
