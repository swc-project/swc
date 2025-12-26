//// [classStaticBlockUseBeforeDef3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.doSomething = function doSomething() {
        console.log("gotcha!");
    };
    return A;
}();
A.doSomething();
var Baz = function Baz() {
    "use strict";
    _class_call_check(this, Baz);
};
console.log(FOO);
var FOO = "FOO";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
console.log(FOO);
var u = "FOO";
var CFA = /*#__PURE__*/ function() {
    "use strict";
    function CFA() {
        _class_call_check(this, CFA);
    }
    CFA.doSomething = function doSomething() {};
    return CFA;
}();
(function() {
    u = "BAR";
    u; // should be "BAR"
})();
CFA.t = 1;
u;
u; // should be "BAR"
