// @allowJs: true
// @noEmit: true
// @strict: true
// @checkJs: true
// @filename: index.js
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
var expected = /** @type {{name: string, readonly middleInit: string, readonly lastName: string, zip: number, readonly houseNumber: number, zipStr: string}} */ (/** @type {*} */ (null));
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
// @filename: validate.ts
// Validate in TS as simple validations would usually be interpreted as more special assignments
var x = require("./");
x.name;
x.middleInit;
x.lastName;
x.zip;
x.houseNumber;
x.zipStr;
x.name = "Another";
x.zip = 98123;
x.zipStr = "OK";
x.lastName = "should fail";
x.houseNumber = 12; // should also fail
x.zipStr = 12; // should fail
x.middleInit = "R"; // should also fail
export { };
