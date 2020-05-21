const swc = require("../");

it("should work", () => {
  expect(() => {
    swc.transformFileSync(__dirname + "/../tests/error/simple.js");
  }).toThrow("jsc");
});
