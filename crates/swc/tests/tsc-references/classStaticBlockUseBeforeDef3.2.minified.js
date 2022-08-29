//// [classStaticBlockUseBeforeDef3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.doSomething = function() {
        console.log("gotcha!");
    }, A;
})().doSomething(), console.log(FOO);
var FOO = "FOO";
console.log(FOO), function() {
    "use strict";
    function CFA() {
        _class_call_check(this, CFA);
    }
    return CFA.doSomething = function() {}, CFA;
}().t = 1;
