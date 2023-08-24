//// [/a.js]
/**
 * @template T
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Foo = function() {
    function Foo() {
        _class_call_check(this, Foo);
    }
    return(/**
     * @param {T} value
     */ Foo.prototype.bar = function(value) {}, Foo);
}();
new Foo();
