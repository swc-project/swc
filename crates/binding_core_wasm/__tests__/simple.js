const swc = require("../pkg");
const fs = require("fs");
const path = require("path");
const util = require("util");

it("should be loadable", function () {
    const output = swc.transformSync("class Foo {}", {});
});

it("should support 'paths' and 'baseUrl'", async () => {
    const { code } = await swc.transformSync(
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

it("should minify", async () => {
    const input = await util.promisify(fs.readFile)(
        path.resolve(__dirname, "../fixture/jquery-3.6.0.js"),
        "utf-8"
    );

    const output = swc.minifySync(input, {});
    expect(output).toMatchSnapshot();
});
