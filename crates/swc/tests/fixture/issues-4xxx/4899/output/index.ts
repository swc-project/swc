define([
    "require",
    "@swc/helpers/src/_ts_decorate.mjs"
], function(require, _ts_decorate) {
    "use strict";
    function es5ClassCompat(target) {
        function _() {
            return Reflect.construct(target, arguments, this.constructor);
        }
        Object.defineProperty(_, "name", Object.getOwnPropertyDescriptor(target, "name"));
        Object.setPrototypeOf(_, target);
        Object.setPrototypeOf(_.prototype, target.prototype);
        return _;
    }
    let Foo = class Foo1 {
        static create() {
            return new Foo();
        }
        constructor(){}
    };
    Foo = _ts_decorate([
        es5ClassCompat
    ], Foo);
});
