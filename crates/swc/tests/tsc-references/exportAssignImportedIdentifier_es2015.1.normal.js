// @Filename: foo1.ts
export function x() {
    return true;
}
// @Filename: foo2.ts
const foo1 = require('./foo1');
var x = foo1.x;
// @Filename: foo3.ts
const foo2 = require('./foo2');
var x = foo2(); // should be boolean
module.exports = x;
