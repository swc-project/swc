const swc = require("../pkg");

describe("transform", () => {
    it("should work", () => {
        const output = swc.transformSync("class Foo {}", {});

        expect(output).toMatchInlineSnapshot(`
          {
            "code": "function _class_call_check(instance, Constructor) {
              if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
          }
          var Foo = function Foo() {
              "use strict";
              _class_call_check(this, Foo);
          };
          ",
            "diagnostics": [],
          }
        `);
    });

    it("should work with async facade", async () => {
        const output = await swc.transform("class Foo {}", {});

        expect(output).toMatchInlineSnapshot(`
          {
            "code": "function _class_call_check(instance, Constructor) {
              if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
          }
          var Foo = function Foo() {
              "use strict";
              _class_call_check(this, Foo);
          };
          ",
            "diagnostics": [],
          }
        `);
    });

    it("should work with program object", async () => {
        const input = swc.parseSync("class Foo {}", {
            syntax: "typescript",
            target: "es2021",
        });

        const output = await swc.transform(input, {});
        expect(output).toMatchInlineSnapshot(`
          {
            "code": "function _class_call_check(instance, Constructor) {
              if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
          }
          var Foo = function Foo() {
              "use strict";
              _class_call_check(this, Foo);
          };
          ",
            "diagnostics": [],
          }
        `);
    });

    it("should support 'paths' and 'baseUrl'", () => {
        const { code } = swc.transformSync(
            `
      import foo from '@src/app';
      console.log(foo)
      `,
            {
                filename: "main.js",
                jsc: {
                    parser: {
                        syntax: "typescript",
                    },
                    target: "es2021",
                    transform: {},
                    baseUrl: __dirname,
                    paths: {
                        "@src/*": ["bar/*"],
                    },
                },
                module: {
                    type: "commonjs",
                },
            }
        );

        expect(code).toContain(`bar/app`);
    });
});

function expectParsedClass(output) {
    expect(output.type).toBe("Module");
    expect(output.body).toHaveLength(1);

    const declaration = output.body[0];
    expect(declaration).toMatchObject({
        type: "ClassDeclaration",
        body: [],
        identifier: {
            type: "Identifier",
            value: "Foo",
        },
    });
    expect(declaration.span.end - declaration.span.start).toBe(12);
    expect(
        declaration.identifier.span.end - declaration.identifier.span.start
    ).toBe(3);
    expect(output.span).toEqual(declaration.span);
}

describe("parse", () => {
    it("should work", () => {
        const output = swc.parseSync("class Foo {}", {
            syntax: "typescript",
            target: "es2021",
        });

        expectParsedClass(output);
    });

    it("should work with async facade", async () => {
        const output = await swc.parse("class Foo {}", {
            syntax: "typescript",
            target: "es2021",
        });

        expectParsedClass(output);
    });
});

describe("minify", () => {
    it("should work", () => {
        const output = swc.minifySync(
            "const somename = 1; console.log(somename);",
            { module: false }
        );

        expect(output).toMatchInlineSnapshot(`
            {
              "code": "const somename=1;console.log(1);",
              "diagnostics": [],
            }
        `);
    });

    it("should work with async facade", async () => {
        const output = await swc.minify(
            "const somename = 1; console.log(somename);",
            { module: false }
        );

        expect(output).toMatchInlineSnapshot(`
            {
              "code": "const somename=1;console.log(1);",
              "diagnostics": [],
            }
        `);
    });
});

describe("print", () => {
    it("should work", () => {
        const input = swc.parseSync("class Foo {}", {
            syntax: "typescript",
            target: "es2021",
        });

        const output = swc.printSync(input);
        expect(output).toMatchInlineSnapshot(`
            {
              "code": "class Foo {
            }
            ",
              "diagnostics": [],
            }
        `);
    });

    it("should work with async facade", async () => {
        const input = swc.parseSync("class Foo {}", {
            syntax: "typescript",
            target: "es2021",
        });

        const output = await swc.print(input);
        expect(output).toMatchInlineSnapshot(`
            {
              "code": "class Foo {
            }
            ",
              "diagnostics": [],
            }
        `);
    });
});
