//// [node.d.ts]
"use strict";
//// [index.js]
"use strict";
var A = require("./other"), a = new A().id, B = function() {
    this.id = 1;
};
B.prototype.m = function() {
    this.x = 2;
};
var b = new B();
b.id, b.x;
//// [other.js]
"use strict";
function A() {
    this.id = 1;
}
module.exports = A;
