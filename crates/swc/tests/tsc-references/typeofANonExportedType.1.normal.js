//// [typeofANonExportedType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x = 1;
export var r1;
var y = {
    foo: ''
};
export var r2;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
export var c;
var c2;
export var r3;
export var r4;
export var r4b;
export var i;
var i2;
export var r5;
export var r5;
(function(M) {
    M.foo = '';
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    M.C = C;
})(M || (M = {}));
export var r6;
export var r7;
export var r8;
export var r9;
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
export var r10;
export var r11;
export var r12;
function foo() {}
(function(foo) {
    foo.y = 1;
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    foo.C = C;
})(foo || (foo = {}));
export var r13;
var M;
