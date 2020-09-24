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


it("should preserve calls", () => {
    const src = `class Foo {
        method() {
            super.foo()
        }
    }`;

    expect(
        swc.transformSync(src, {
            jsc: {
                transform: {
                    hidden: {
                        jest: true
                    }
                },
                target: 'es2019'
            }
        })
            .code.trim()
    ).toBe(`class Foo {
    method() {
        super.foo();
    }
}`);
});
