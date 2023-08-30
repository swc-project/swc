import path from "path";
import swc from "../../..";

describe('jsc.paths', () => {

    it("should work with process.cwd()", async () => {
        expect((await swc.transformFile(path.join(


            "tests", "swc-path-bug-1", "src", "index.ts"
        ), {
            jsc: {
                parser: {
                    syntax: 'typescript',
                },
                baseUrl: process.cwd(),
            }
        })).code).toMatchInlineSnapshot(`
            "\\"\\".concat(100, \\"testing\\");
            "
        `);
    });
})
