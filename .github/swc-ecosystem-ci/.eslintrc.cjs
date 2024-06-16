// @ts-check
const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:n/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2021,
  },
  rules: {
    eqeqeq: ["warn", "always", { null: "never" }],
    "no-debugger": ["error"],
    "no-empty": ["warn", { allowEmptyCatch: true }],
    "no-process-exit": "off",
    "no-useless-escape": "off",
    "prefer-const": [
      "warn",
      {
        destructuring: "all",
      },
    ],
    "n/no-missing-import": "off", // doesn't like ts imports
    "n/no-process-exit": "off",
    "@typescript-eslint/no-explicit-any": "off", // we use any in some places
  },
});
