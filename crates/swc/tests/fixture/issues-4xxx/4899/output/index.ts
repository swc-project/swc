var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
function es5ClassCompat(target) {
    function _() {
        return Reflect.construct(target, arguments, this.constructor);
    }
    Object.defineProperty(_, "name", Object.getOwnPropertyDescriptor(target, "name"));
    Object.setPrototypeOf(_, target);
    Object.setPrototypeOf(_.prototype, target.prototype);
    return _;
}
class Foo {
    static create() {
        return new Foo();
    }
    constructor(){}
}
Foo = _ts_decorate._([
    es5ClassCompat
], Foo);
