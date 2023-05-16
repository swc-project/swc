//// [/a.js]
/**
 * @template T
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    var _proto = Foo.prototype;
    /**
     * @param {T} value
     */ _proto.bar = function bar(value) {};
    return Foo;
}();
/** @type {Foo<number>} */ var foo;
foo = new Foo();
