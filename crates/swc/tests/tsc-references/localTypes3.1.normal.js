//// [localTypes3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
    var C = f();
    var v = new C(10, "hello");
    var x = v.x;
    var y = v.y;
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
    var C = f(10);
    var v = new C("hello");
    var x = v.x;
    var y = v.y;
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
    var C = f(10, "hello");
    var v = new C();
    var x = v.x;
    var y = v.y;
}
