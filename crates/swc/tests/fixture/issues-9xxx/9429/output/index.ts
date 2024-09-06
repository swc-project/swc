var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
class Foo {
    static #loggedMethod(_prototype, _propertyKey, descriptor) {
        const method = descriptor.value;
        descriptor.value = function(...args) {
            try {
                console.log("before");
                return method.apply(this, args);
            } finally{
                console.log("after");
            }
        };
    }
    greet() {
        console.log("hi");
    }
    static{
        _ts_decorate._([
            Foo.#loggedMethod
        ], Foo.prototype, "greet", null);
    }
}
const foo = new Foo();
foo.greet();
