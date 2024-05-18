import path from "node:path";
import { fileURLToPath } from "node:url";
import swc from "../..";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

it("should transpile import path correctly", async () => {
    const baseUrl = path.resolve(__dirname, "../../tests/issue-8674");
    console.log("baseUrl", baseUrl);
    process.chdir(baseUrl);

    const { code } = await swc.transform(
        `
        import { foo } from "src/foo"
        console.log(foo)
    `,
        {
            jsc: {
                baseUrl,
            },
        }
    );

    expect(code).toMatchInlineSnapshot(`
        "import { foo } from "./src/foo";
        console.log(foo);
        "
    `);
});
