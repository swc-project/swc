import path from "path";
import swc from "../../..";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

describe('jsc.paths', () => {

    it("should work with process.cwd()", async () => {
        const f = path.join(


            __filename, '..', '..', '..', "tests", "swc-path-bug-1", "src", "index.ts"
        )
        console.log(f)
        expect((await swc.transformFile(f, {
            jsc: {
                parser: {
                    syntax: 'typescript',
                },
                baseUrl: process.cwd(),
                paths: {
                    "@utils/*": [
                        "src/utils/*"
                    ],
                }
            }
        })).code).toMatchInlineSnapshot(`
            "\\"\\".concat(100, \\"testing\\");
            "
        `);
    });
})
