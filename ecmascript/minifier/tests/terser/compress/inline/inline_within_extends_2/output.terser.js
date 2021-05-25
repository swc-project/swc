class Baz extends (function (foo_base) {
    return class extends foo_base {
        constructor() {
            super(...arguments);
        }
        second() {
            return this[1];
        }
    };
})(
    (function (bar_base) {
        return class extends bar_base {
            constructor(...args) {
                super(...args);
            }
        };
    })(Array)
) {
    constructor() {
        super(...arguments);
    }
}
console.log(new Baz(1, "PASS", 3).second());
