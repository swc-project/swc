const swc = require("../pkg");

it("should be loadable", function () {
  const output = swc.transformSync("class Foo {}", {});
});


it("should support 'paths' and 'baseUrl'", async () => {
  const { code } = await swc.transform(`
  import foo from '@src/app';
  console.log(foo)
  `, {
    jsc: {
      parser: {
        syntax: 'typescript',
      },
      target: 'es2021',
      transform: {

      },
      baseUrl: __dirname,
      paths: {
        '@src/*': ['bar/*']
      }
    },
    module: {
      type: 'commonjs'
    },
  });

  expect(code).toContain(`bar/app`);
})
