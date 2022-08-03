const swc = require("../pkg");

describe("transform", () => {
    it("should work", function () {
        const output = swc.transformSync("class Foo {}", {});

        expect(output).toMatchInlineSnapshot(`
            Object {
              "code": "function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError(\\"Cannot call a class as a function\\");
                }
            }
            var Foo = function Foo() {
                \\"use strict\\";
                _classCallCheck(this, Foo);
            };
            ",
            }
        `);
    });

    it("should work with async facade", async () => {
        const output = await swc.transform("class Foo {}", {});

        expect(output).toMatchInlineSnapshot(`
            Object {
              "code": "function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError(\\"Cannot call a class as a function\\");
                }
            }
            var Foo = function Foo() {
                \\"use strict\\";
                _classCallCheck(this, Foo);
            };
            ",
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
            Object {
              "code": "function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError(\\"Cannot call a class as a function\\");
                }
            }
            var Foo = function Foo() {
                \\"use strict\\";
                _classCallCheck(this, Foo);
            };
            ",
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

describe("parse", () => {
    it("should work", () => {
        const output = swc.parseSync("class Foo {}", {
            syntax: "typescript",
            target: "es2021",
        });

        expect(output).toMatchInlineSnapshot(`
            Object {
              "body": Array [
                Object {
                  "body": Array [],
                  "declare": false,
                  "decorators": Array [],
                  "identifier": Object {
                    "optional": false,
                    "span": Object {
                      "ctxt": 0,
                      "end": 394,
                      "start": 391,
                    },
                    "type": "Identifier",
                    "value": "Foo",
                  },
                  "implements": Array [],
                  "isAbstract": false,
                  "span": Object {
                    "ctxt": 0,
                    "end": 397,
                    "start": 385,
                  },
                  "superClass": null,
                  "superTypeParams": null,
                  "type": "ClassDeclaration",
                  "typeParams": null,
                },
              ],
              "interpreter": null,
              "span": Object {
                "ctxt": 0,
                "end": 397,
                "start": 385,
              },
              "type": "Module",
            }
        `);
    });

    it("should work with async facade", async () => {
        const output = await swc.parse("class Foo {}", {
            syntax: "typescript",
            target: "es2021",
        });

        expect(output).toMatchInlineSnapshot(`
            Object {
              "body": Array [
                Object {
                  "body": Array [],
                  "declare": false,
                  "decorators": Array [],
                  "identifier": Object {
                    "optional": false,
                    "span": Object {
                      "ctxt": 0,
                      "end": 407,
                      "start": 404,
                    },
                    "type": "Identifier",
                    "value": "Foo",
                  },
                  "implements": Array [],
                  "isAbstract": false,
                  "span": Object {
                    "ctxt": 0,
                    "end": 410,
                    "start": 398,
                  },
                  "superClass": null,
                  "superTypeParams": null,
                  "type": "ClassDeclaration",
                  "typeParams": null,
                },
              ],
              "interpreter": null,
              "span": Object {
                "ctxt": 0,
                "end": 410,
                "start": 398,
              },
              "type": "Module",
            }
        `);
    });
});

describe("minify", () => {
    it("should work", () => {
        const output = swc.minifySync(
            "const somename = 1; console.log(somename);"
        );

        expect(output).toMatchInlineSnapshot(`
            Object {
              "code": "const o=1;console.log(1)",
            }
        `);
    });

    it("should work with async facade", async () => {
        const output = await swc.minify(
            "const somename = 1; console.log(somename);"
        );

        expect(output).toMatchInlineSnapshot(`
            Object {
              "code": "const o=1;console.log(1)",
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
            Object {
              "code": "class Foo {
            }
            ",
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
            Object {
              "code": "class Foo {
            }
            ",
            }
        `);
    });
});
