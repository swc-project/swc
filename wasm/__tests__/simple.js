it("should be loadable", function () {
  const swc = require("../pkg");
  const output = swc.transformSync("class Foo {}", {});
});
