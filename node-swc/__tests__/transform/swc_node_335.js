const swc = require('../../..');


it("should handle es2019", () => {
  expect(
    swc.transformSync(`
    class Foo {
      method() {
        class Foo {

        }
      }
    }
    `, {
      jsc: {
        keepClassNames: true,
        target: 'es2017',
      }
    })
      .code.trim()
  ).toContain(`let Foo1 = class Foo {`);
});