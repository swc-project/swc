// @Filename: foo1.ts
module.exports = M1;
export { };
// @Filename: foo2.ts
var foo1 = require("./foo1");
var x = foo1.b();
export { };
