//// [assignmentToVoidZero2.js]
"use strict";
exports.j = 1;
exports.k = void 0;
var o = {};
o.x = 1;
o.y = void 0;
o.x + o.y;
function C() {
    this.p = 1;
    this.q = void 0;
}
var c = new C();
c.p + c.q;
//// [importer.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _assignmentToVoidZero2 = require("./assignmentToVoidZero2");
_assignmentToVoidZero2.j + _assignmentToVoidZero2.k;
