class Base {
    method() {
        return this === undefined;
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
    method() {
        "use strict";
        return this === undefined;
    },
};
const object = {
    __proto__: base,
    call() {
        return (0, super.method)();
    },
};
const derived = new Derived();
console.log(derived.call(), derived.tagged(), derived.direct(), object.call());
