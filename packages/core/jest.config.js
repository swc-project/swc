module.exports = {
    projects: [
        /* Noram unit tests node-swc runs */
        {
            displayName: "unit tests",
            testMatch: [
                "**/__tests__/**/*.[jt]s?(x)",
                "**/__tests__/**/*.m[jt]s?(x)",
                "**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)",
            ],
            transform: {},
            // transform: {
            //     "^.+\\.jsx?$": "babel-jest",
            //     "^.+\\.mjs$": "babel-jest",
            // },
            testPathIgnorePatterns: [
                "<rootDir>/build/",
                "<rootDir>/node_modules/",
            ],
            moduleFileExtensions: ["js", "jsx", "mjs"],
        },
        /* Integration tests requires a fixture setup to run tests, like plugins */
        !!process.env.DISABLE_PLUGIN_E2E_TESTS
            ? undefined
            : {
                  displayName: "e2e tests",
                  testMatch: ["**/e2e/**/?(*.)+(spec|test).[jt]s?(x)"],
                  moduleFileExtensions: ["js", "jsx", "mjs"],
              },
    ].filter(Boolean),
};
