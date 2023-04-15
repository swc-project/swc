//// [/a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    /**
     * @template T
     * @this {T}
     * @return {T}
     */ _proto.b = function b() {
        return this;
    };
    /**
     * @template T
     * @this {T}
     * @return {T}
     */ C.a = function a() {
        return this;
    };
    return C;
}();
var a = C.a();
a; // typeof C
var c = new C();
var b = c.b();
b; // C
