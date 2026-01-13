//// [mod1.js]
/**
 * @constructor
 * @param {string} name
 */ function Person(name) {
    this.name = name;
}
Person.prototype.describe = function() {
    return "Person called " + this.name;
};
Object.defineProperty(Person.prototype, "thing", {
    value: 42,
    writable: true
});
Object.defineProperty(Person.prototype, "readonlyProp", {
    value: "Smith",
    writable: false
});
Object.defineProperty(Person.prototype, "rwAccessors", {
    get: function get() {
        return 98122;
    },
    set: function set(_) {}
});
Object.defineProperty(Person.prototype, "readonlyAccessor", {
    get: function get() {
        return 21.75;
    }
});
Object.defineProperty(Person.prototype, "setonlyAccessor", {
    /** @param {string} str */ set: function set(str) {
        this.rwAccessors = Number(str);
    }
});
module.exports = Person;
//// [validator.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[3:1]
//!  1 | import "./";
//!  2 | 
//!  3 | import Person = require("./mod1");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  4 | 
//!  5 | const m1 = new Person("Name")
//!    `----
