// @module: commonjs
// @Filename: foo1.ts
class x {
}
module.exports = x;
export { };
// @Filename: foo2.ts
const foo1 = require('./foo1');
var x = foo1;
class y extends x {
}
export { };
