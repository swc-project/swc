import swc from "../../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should transpile decorators", async () => {
    const filename = join(
        __dirname,
        "..",
        "..",
        "tests",
        "issue-4734",
        "1",
        "index.ts"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
    });
    expect(code).toMatchInlineSnapshot(`
"import { jsx as _jsx } from \\"react/jsx-runtime\\";
export default function foo() {
    return /*#__PURE__*/ _jsx(\\"div\\", {
        children: \\"Hello\\"
    });
};
"
`);
});
