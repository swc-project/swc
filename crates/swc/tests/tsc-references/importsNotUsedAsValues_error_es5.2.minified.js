import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _default = function() {
    "use strict";
    _class_call_check(this, _default);
};
export var A = function() {
    "use strict";
    _class_call_check(this, A);
};
export var C;
!function(C) {
    C[C.One = 0] = "One", C[C.Two = 1] = "Two";
}(C || (C = {}));
export { _default as default };
var a, b;
console.log(a, b);
export { };
var a, b;
console.log(a, b);
export { };
var b;
import { A } from "./a";
console.log(A, b);
export { };
import { C } from "./a";
C.One;
var c = C.Two, d = C.Two;
console.log(c, d);
var c, d;
console.log(c, d);
export { };
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var H = function() {
    "use strict";
    _class_call_check(this, H);
};
module.exports = H;
require("./h"), console.log({});
export { };
require("./h");
export { };
var K;
!function(K) {
    K[K.One = 0] = "One", K[K.Two = 1] = "Two";
}(K || (K = {})), module.exports = K;
export { };
require("./k").One;
export { };
