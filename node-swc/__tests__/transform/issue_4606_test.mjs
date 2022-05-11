import swc from "../../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));


it("should override react", async () => {
  const { code } = await swc.transform(`export default function foo() {
    return <div>Hello</div>;
}`, {
    "jsc": {
      "target": "es2017",
      "transform": {
        "react": {
          "runtime": "automatic"
        }
      },
      "parser": {
        "syntax": "typescript",
        "tsx": true,
        "dts": true,
        "dynamicImport": true
      },
      "externalHelpers": true
    },
    "module": {
      "type": "es6"
    }
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

it("should merge correctly", async () => {
  const { code } = await swc.transformFile(join(__dirname, "..", 'tests', 'issue-4606', 'input.tsx'));
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