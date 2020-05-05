const swc = require("../pkg");

it("properly reports error", function () {
  const output = expect(() => {
    swc.transformSync("Foo {}", {});
  }).toThrow("failed to process code: failed to parse module");
});
