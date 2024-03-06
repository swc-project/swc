import path from "node:path";
import { fileURLToPath } from "node:url";
import swc from "../../..";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

it("should transpile import path correctly", async () => {
    const baseUrl = path.resolve(__dirname, "../../tests/issue-8701");
    console.log("baseUrl", baseUrl);
    process.chdir(baseUrl);

    const { code } = await swc.transformFile("src/app.module.ts", {
        jsc: {
            baseUrl,
            paths: {
                "@app/*": ["./src/*"],
            },
            parser: {
                syntax: "typescript",
                decorators: true,
            },
            target: "es2019",
        },
    });

    expect(code).toMatchInlineSnapshot(`
    `);
});
