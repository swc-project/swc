// @module: commonjs
// @Filename: foo1.ts
class x {
}
// @Filename: foo2.ts
const foo1 = require('./foo1');
var x = foo1;
class y extends x {
}
module.exports = x;
export { };
