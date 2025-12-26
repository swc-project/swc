//// [classStaticBlockUseBeforeDef3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
/*#__PURE__*/ (function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.doSomething = function() {
        console.log("gotcha!");
    }, A;
})().doSomething(), console.log(FOO);
var FOO = "FOO";
console.log(FOO), /*#__PURE__*/ function() {
    function CFA() {
        _class_call_check(this, CFA);
    }
    return CFA.doSomething = function() {}, CFA;
}().t = 1;
