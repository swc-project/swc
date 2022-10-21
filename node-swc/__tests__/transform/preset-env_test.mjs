import swc from "../../..";


it("should respect custom transform option", async () => {
    const { code } = await swc.transform(
        `
        const spread = 1;
        const { foo, ...rest } = { ...spread }
        
        async function bar() {
            await 1;
        }
        function* baz() {
            yield 1;
            yield 2;
        }
        `,
        {
            jsc: {

            },
        }
    );
    expect(code).toMatchInlineSnapshot(`
        "import { jsx as _jsx } from \\"react/jsx-runtime\\";
        export default function foo() {
            return /*#__PURE__*/ _jsx(\\"div\\", {
                children: \\"Hello\\"
            });
        }
        "
    `);
});

