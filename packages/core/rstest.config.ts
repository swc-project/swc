import path from "node:path";
import { defineConfig } from "@rstest/core";

/**
 * Keep native addons (`*.node`) out of the test bundle.
 *
 * Since `@rstest/core` 0.12, a bundled `require("./swc.<platform>.node")`
 * returns an ES module wrapper (`{ __esModule, default }`) instead of the
 * addon exports. `binding.js` copies each export from that object, so every
 * binding function becomes `undefined`. Requiring the addon from its absolute
 * path at runtime returns the real exports.
 */
const nativeAddonExternals = [
    (
        { request, context }: { request?: string; context?: string },
        callback: (err?: Error, result?: string) => void,
    ) => {
        if (request && context && request.endsWith(".node")) {
            return callback(
                undefined,
                `commonjs ${path.resolve(context, request)}`,
            );
        }
        callback();
    },
];

export default defineConfig({
    projects: [
        /* Normal unit tests node-swc runs */
        {
            name: "unit tests",
            setupFiles: ["./native-test-setup.ts"],
            globals: true,
            output: { externals: nativeAddonExternals },
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
                  setupFiles: ["./native-test-setup.ts"],
                  globals: true,
                  output: { externals: nativeAddonExternals },
                  include: ["**/e2e/**/?(*.)+(spec|test).[jt]s?(x)"],
              },
    ].filter((x): x is NonNullable<typeof x> => Boolean(x)),
});
