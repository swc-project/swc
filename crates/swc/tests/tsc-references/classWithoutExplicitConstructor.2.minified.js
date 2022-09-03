//// [classWithoutExplicitConstructor.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C), this.x = 1, this.y = "hello";
}, c = new C(), c2 = new C(null), D = function D() {
    "use strict";
    _class_call_check(this, D), this.x = 2, this.y = null;
}, d = new D(), d2 = new D(null);
