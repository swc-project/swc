import swc from "../../..";


it("should override react", async () => {
  const code = await swc.transform(`export default function foo() {
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
  })
    .code.trim();
  expect(code).toMatchInlineSnapshot(`foo`);
});