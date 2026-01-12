//// [index.js]
var x = {};
Object.defineProperty(x, "name", {
    value: "Charles",
    writable: true
});
Object.defineProperty(x, "middleInit", {
    value: "H"
});
Object.defineProperty(x, "lastName", {
    value: "Smith",
    writable: false
});
Object.defineProperty(x, "zip", {
    get: function get() {
        return 98122;
    },
    set: function set(_) {}
});
Object.defineProperty(x, "houseNumber", {
    get: function get() {
        return 21.75;
    }
});
Object.defineProperty(x, "zipStr", {
    /** @param {string} str */ set: function set(str) {
        this.zip = Number(str);
    }
});
/**
 * @param {{name: string}} named
 */ function takeName(named) {
    return named.name;
}
takeName(x);
/**
 * @type {number}
 */ var a = x.zip;
/**
 * @type {number}
 */ var b = x.houseNumber;
var returnExemplar = function() {
    return x;
};
var needsExemplar = function() {
    var _ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : x;
    return void 0;
};
var expected = /** @type {*} */ null;
/**
 * 
 * @param {typeof returnExemplar} a 
 * @param {typeof needsExemplar} b 
 */ function match(a, b) {}
match(function() {
    return expected;
}, function() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : expected;
    return void 0;
});
module.exports = x;
//// [validate.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[2:1]
//!  1 | // Validate in TS as simple validations would usually be interpreted as more special assignments
//!  2 | import x = require("./");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | x.name;
//!  4 | x.middleInit;
//!  5 | x.lastName;
//!    `----
