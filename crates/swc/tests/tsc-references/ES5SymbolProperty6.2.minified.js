//// [ES5SymbolProperty6.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(new (function() {
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto[Symbol.iterator] = function() {}, C;
}()))[Symbol.iterator];
