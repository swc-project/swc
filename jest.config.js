module.exports = {
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/__tests__/**/*.m[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    transform: {
    },
    // transform: {
    //     "^.+\\.jsx?$": "babel-jest",
    //     "^.+\\.mjs$": "babel-jest",
    // },
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    moduleFileExtensions: ["js", "jsx", "mjs"]
}
