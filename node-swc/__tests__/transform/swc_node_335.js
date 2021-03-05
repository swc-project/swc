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
        keepClassNames: true
      }
    })
      .code.trim()
  ).toContain(`let Foo1 = class Foo {`);
});