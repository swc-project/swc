//// [classWithoutExplicitConstructor.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C), this.x = 1, this.y = "hello";
};
new C(), new C(null);
var D = function D() {
    "use strict";
    _class_call_check(this, D), this.x = 2, this.y = null;
};
new D(), new D(null);
