export function x() {
    return !0;
}
let foo1 = require('./foo1');
var x = foo1.x;
module.exports = x;
export { };
let foo2 = require('./foo2');
foo2();
export { };
