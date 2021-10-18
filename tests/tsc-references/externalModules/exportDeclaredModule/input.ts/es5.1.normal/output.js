module.exports = M1;
// @Filename: foo2.ts
var foo1 = require('./foo1');
var x = foo1.b();
// @Filename: foo1.ts
export { };
