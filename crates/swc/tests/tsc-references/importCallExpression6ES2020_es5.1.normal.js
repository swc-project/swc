import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
export function foo() {
    return "foo";
}
// @filename: 1.ts
export function backup() {
    return "backup";
}
var specify = bar() ? "./0" : undefined;
var myModule = import(specify);
var myModule1 = import(undefined);
var myModule2 = import(bar() ? "./1" : null);
var myModule3 = import(null);
