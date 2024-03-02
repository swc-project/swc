import path from "path";
import swc from "../../..";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

describe("jsc.paths", () => {
    it("should work with process.cwd()", async () => {
        console.log(process.cwd());
        const f = path.join(
            __filename,
            "..",
            "..",
            "..",
            "tests",
            "swc-path-bug-1",
            "src",
            "index.ts"
        );
        console.log(f);
        expect(
            (
                await swc.transformFile(f, {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                        },
                        baseUrl: process.cwd(),
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
            const _helloworldutils = require("src/utils/hello-world.utils.js");
            console.log((0, _helloworldutils.helloWorld)());
            "
        `);
    });

    it("should work with process.cwd() and relative url", async () => {
        console.log(process.cwd());
        const f = path.join(
            "node-swc",
            "tests",
            "swc-path-bug-1",
            "src",
            "index.ts"
        );
        console.log(f);
        expect(
            (
                await swc.transformFile(f, {
                    jsc: {
                        parser: {
                            syntax: "typescript",
                        },
                        baseUrl: process.cwd(),
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
            const _helloworldutils = require("src/utils/hello-world.utils.js");
            console.log((0, _helloworldutils.helloWorld)());
            "
        `);
    });
});
