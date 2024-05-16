import swc from "../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should allow using tsx", async () => {
    const filename = join(
        __dirname,
        "..",
        "..",
        "tests",
        "issue-4621",
        "1",
        "index.tsx"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        jsc: {
            target: "es5",
            parser: {
                syntax: "typescript",
                tsx: true,
            },
        },
    });
    expect(code).toMatchInlineSnapshot(`
        "import { jsx as _jsx } from "react/jsx-runtime";
        export default function foo() {
            return /*#__PURE__*/ _jsx("div", {
                children: "Hello"
            });
        }
        "
    `);
});

it("should respect .swcrc without parser option", async () => {
    const filename = join(
        __dirname,
        "..",
        "..",
        "tests",
        "issue-4621",
        "1",
        "index.tsx"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        jsc: {
            target: "es5",
        },
    });
    expect(code).toMatchInlineSnapshot(`
        "import { jsx as _jsx } from "react/jsx-runtime";
        export default function foo() {
            return /*#__PURE__*/ _jsx("div", {
                children: "Hello"
            });
        }
        "
    `);
});
