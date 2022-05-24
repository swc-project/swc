import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @module: es2020
// @target: es2020
// @filename: 0.ts
export var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.print = function print() {
        return "I am B";
    };
    return B;
}();
// @filename: 2.ts
function foo(x) {
    x.then(function(value) {
        var b = new value.B();
        b.print();
    });
}
foo(import("./0"));
