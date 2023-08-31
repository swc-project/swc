//// [/a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var C = function() {
    function C() {
        _class_call_check(this, C);
    }
    return(/**
     * @template T
     * @this {T}
     * @return {T}
     */ C.prototype.b = function() {
        return this;
    }, /**
     * @template T
     * @this {T}
     * @return {T}
     */ C.a = function() {
        return this;
    }, C);
}();
C.a(), new C().b();
 // C
