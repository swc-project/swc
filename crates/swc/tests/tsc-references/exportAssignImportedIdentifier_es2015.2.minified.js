export function x() {
    return !0;
}
let foo1 = require('./foo1');
var x = foo1.x;
let foo2 = require('./foo2');
var x = foo2();
module.exports = x;
