import path from "path";
import swc from "../..";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

describe("jsc.paths", () => {
    it("should work with process.cwd()", async () => {
        const testDir = path.join(
            __filename,
            "..",
            "..",
            "..",
            "tests",
            "swc-path-bug-1"
        );
        const f = path.join(testDir, "src", "index.ts");
        console.log(f);
        expect(
            (
                await swc.transformFile(f, {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                        },
                        baseUrl: testDir,
                        paths: {
                            "@utils/*": ["src/utils/*"],
                        },
                    },
                })
            ).code
        ).toMatchInlineSnapshot(`
            ""use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const _helloworldutils = require("./utils/hello-world.utils.js");
            console.log((0, _helloworldutils.helloWorld)());
            "
        `);
    });

    it("should work with process.cwd() and relative url", async () => {
        const testDir = path.join("tests", "swc-path-bug-1");
        const f = path.join(testDir, "src", "index.ts");
        console.log(f);
        expect(
            (
                await swc.transformFile(f, {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                        },
                        baseUrl: path.resolve(testDir),
                        paths: {
                            "@utils/*": ["src/utils/*"],
                        },
                    },
                })
            ).code
        ).toMatchInlineSnapshot(`
            ""use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const _helloworldutils = require("./utils/hello-world.utils.js");
            console.log((0, _helloworldutils.helloWorld)());
            "
        `);
    });
});
