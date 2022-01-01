const swc = require("../pkg");

it("sends NULL character literals (2853)", function () {
  expect(swc.transformSync(`const a = "\0a"`, {})).toEqual({code: `var a = "\\x00a";\n`});
  expect(swc.transformSync(`const a = "\\0a"`, {})).toEqual({code: `var a = "\\x00a";\n`});
});
