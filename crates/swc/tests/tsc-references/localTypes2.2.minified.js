//// [localTypes2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f1() {
    var v = new function C(x, y) {
        "use strict";
        _class_call_check(this, C), this.x = x, this.y = y;
    }(10, 20);
    v.x, v.y;
}
function f2() {
    var v = new function C(y) {
        "use strict";
        _class_call_check(this, C), this.y = y, this.x = 10;
    }(20);
    v.x, v.y;
}
function f3() {
    var v = new function C() {
        "use strict";
        _class_call_check(this, C), this.x = 10, this.y = 20;
    }();
    v.x, v.y;
}
