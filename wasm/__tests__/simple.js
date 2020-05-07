const swc = require("../pkg");

it("should be loadable", function () {
  const output = swc.transformSync("class Foo {}", {});
});
