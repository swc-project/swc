class Baz extends foo(bar(Array)) {
    constructor() {
        super(...arguments);
    }
}
function foo(foo_base) {
    return class extends foo_base {
        constructor() {
            super(...arguments);
        }
        second() {
            return this[1];
        }
    };
}
function bar(bar_base) {
    return class extends bar_base {
        constructor(...args) {
            super(...args);
        }
    };
}
console.log(new Baz(1, "PASS", 3).second());
