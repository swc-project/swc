const swc = require("../pkg");

it("properly reports error", function () {
  expect(() => {
    swc.transformSync("Foo {}", {});
  }).toThrow("failed to process code: failed to parse module");

  expect(() => {
    swc.transformSync("Foo {}", {});
  }).toThrow("error: Expected ';', '}' or <eof>");
});
