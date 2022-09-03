//// [index.js]
var x = {};
function takeName(named) {
    return named.name;
}
Object.defineProperty(x, "name", {
    value: "Charles",
    writable: !0
}), Object.defineProperty(x, "middleInit", {
    value: "H"
}), Object.defineProperty(x, "lastName", {
    value: "Smith",
    writable: !1
}), Object.defineProperty(x, "zip", {
    get: function() {
        return 98122;
    },
    set: function(_) {}
}), Object.defineProperty(x, "houseNumber", {
    get: function() {
        return 21.75;
    }
}), Object.defineProperty(x, "zipStr", {
    set: function(str) {
        this.zip = Number(str);
    }
}), takeName(x);
var a = x.zip, b = x.houseNumber, returnExemplar = function() {
    return x;
}, needsExemplar = function() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}, expected = null;
function match(a, b) {}
match(function() {
    return expected;
}, function() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}), module.exports = x;
//// [validate.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  2 | import x = require("./");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
