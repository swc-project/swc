module.exports = {
    projects: [
        /* Noram unit tests node-swc runs */
        {
            displayName: "unit tests",
            testMatch: [
                "**/__tests__/**/*.[jt]s?(x)",
                "**/__tests__/**/*.m[jt]s?(x)",
                "**/?(*.)+(spec|test).[jt]s?(x)",
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
        {
            displayName: "e2e tests",
            testMatch: ["**/node-swc/e2e/**/?(*.)+(spec|test).[jt]s?(x)"],
            globalSetup: "./node-swc/e2e/global_setup.js",
        },
    ],
};
