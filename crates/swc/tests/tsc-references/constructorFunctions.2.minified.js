//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function C1() {
    if (!_instanceof(this, C1)) return new C1();
    this.x = 1;
}
C1(), new C1();
var C2 = function() {
    if (!_instanceof(this, C2)) return new C2();
    this.x = 1;
};
function C3() {
    if (!_instanceof(this, C3)) return new C3();
}
C2(), new C2(), C3(), new C3();
var C4 = function() {
    if (!_instanceof(this, C4)) return new C4();
};
C4(), new C4(), new function c5_v2() {
    _class_call_check(this, c5_v2);
}(), new function() {
    this.functions = [
        function(x) {
            return x;
        },
        function(x) {
            return x + 1;
        },
        function(x) {
            return x - 1;
        }
    ];
}();
