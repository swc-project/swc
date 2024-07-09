const swc = require("../pkg");

describe("transform", () => {
    it("should work", function () {
        const output = swc.transformSync("class Foo {}", {});

        expect(output).toMatchInlineSnapshot(`
            {
              "code": "function _class_call_check(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            var Foo = function Foo() {
                "use strict";
                _class_call_check(this, Foo);
            };
            ",
            }
        `);
    });

    it("should work with async facade", async () => {
        const output = await swc.transform("class Foo {}", {});

        expect(output).toMatchInlineSnapshot(`
            {
              "code": "function _class_call_check(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            var Foo = function Foo() {
                "use strict";
                _class_call_check(this, Foo);
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
            {
              "code": "function _class_call_check(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            var Foo = function Foo() {
                "use strict";
                _class_call_check(this, Foo);
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
            {
              "body": [
                {
                  "body": [],
                  "ctxt": 0,
                  "declare": false,
                  "decorators": [],
                  "identifier": {
                    "ctxt": 2,
                    "optional": false,
                    "span": {
                      "end": 289,
                      "start": 286,
                    },
                    "type": "Identifier",
                    "value": "Foo",
                  },
                  "implements": [],
                  "isAbstract": false,
                  "span": {
                    "end": 292,
                    "start": 280,
                  },
                  "superClass": null,
                  "superTypeParams": null,
                  "type": "ClassDeclaration",
                  "typeParams": null,
                },
              ],
              "interpreter": null,
              "span": {
                "end": 292,
                "start": 280,
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
            {
              "body": [
                {
                  "body": [],
                  "ctxt": 0,
                  "declare": false,
                  "decorators": [],
                  "identifier": {
                    "ctxt": 2,
                    "optional": false,
                    "span": {
                      "end": 302,
                      "start": 299,
                    },
                    "type": "Identifier",
                    "value": "Foo",
                  },
                  "implements": [],
                  "isAbstract": false,
                  "span": {
                    "end": 305,
                    "start": 293,
                  },
                  "superClass": null,
                  "superTypeParams": null,
                  "type": "ClassDeclaration",
                  "typeParams": null,
                },
              ],
              "interpreter": null,
              "span": {
                "end": 305,
                "start": 293,
              },
              "type": "Module",
            }
        `);
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
              "code": "let somename=1;console.log(1);",
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
              "code": "let somename=1;console.log(1);",
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
            }
        `);
    });
});
