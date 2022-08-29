//// [ES5SymbolProperty3.ts]
var Symbol;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(new (function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype[Symbol.iterator] = function() {}, C;
}()))[Symbol.iterator];
