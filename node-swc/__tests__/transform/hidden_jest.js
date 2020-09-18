const swc = require("../../../");

it("should hoist methods", () => {
    const src = 'console.log("Hello"); jest.mock(); console.log("World")';

    expect(
        swc.transformSync(src, {
            jsc: {
                transform: {
                    hidden: {
                        jest: true
                    }
                }
            }
        })
            .code.trim()
    ).toBe(`jest.mock();
console.log(\"Hello\");
console.log(\"World\");`);
});
