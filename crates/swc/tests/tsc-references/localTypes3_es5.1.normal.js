import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
function f1() {
    var f = function f() {
        var C = function C(x, y) {
            "use strict";
            _class_call_check(this, C);
            this.x = x;
            this.y = y;
        };
        return C;
    };
    var C1 = f();
    var v = new C1(10, "hello");
    var x1 = v.x;
    var y1 = v.y;
}
function f2() {
    var f = function f(x) {
        var C = function C(y) {
            "use strict";
            _class_call_check(this, C);
            this.y = y;
            this.x = x;
        };
        return C;
    };
    var C2 = f(10);
    var v = new C2("hello");
    var x2 = v.x;
    var y2 = v.y;
}
function f3() {
    var f = function f(x, y) {
        var C = function C() {
            "use strict";
            _class_call_check(this, C);
            this.x = x;
            this.y = y;
        };
        return C;
    };
    var C3 = f(10, "hello");
    var v = new C3();
    var x3 = v.x;
    var y3 = v.y;
}
