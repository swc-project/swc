class Base {
    method() {
        return void 0 === this;
    }
}
class Derived extends Base {
    call() {
        return (0, super.method)();
    }
    tagged() {
        return (0, super.method)``;
    }
    direct() {
        return super.method();
    }
}
const base = {
    method () {
        "use strict";
        return void 0 === this;
    }
}, object = {
    __proto__: base,
    call () {
        return (0, super.method)();
    }
}, derived = new Derived();
console.log(derived.call(), derived.tagged(), derived.direct(), object.call());
