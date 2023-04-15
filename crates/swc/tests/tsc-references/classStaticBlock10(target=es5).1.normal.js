//// [classStaticBlock10.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var a1 = 1;
var a2 = 1;
var b1 = 2;
var b2 = 2;
function f() {
    var a1 = 11;
    var b1 = 22;
    var C1 = function C1() {
        "use strict";
        _class_call_check(this, C1);
    };
    (function() {
        var a1 = 111;
        var a2 = 111;
        var b1 = 222;
        var b2 = 222;
    })();
}
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
(function() {
    var a1 = 111;
    var a2 = 111;
    var b1 = 222;
    var b2 = 222;
})();
