import * as swcHelpers from "@swc/helpers";
var Entry = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @lib: esnext
// @Filename: bug25127.js
/*#__PURE__*/ function() {
    "use strict";
    function Entry() {
        swcHelpers.classCallCheck(this, Entry);
        this.c = 1;
    }
    swcHelpers.createClass(Entry, [
        {
            /**
     * @param {any} x
     * @return {this is Entry}
     */ key: "isInit",
            value: function isInit(x) {
                return true;
            }
        }
    ]);
    return Entry;
}();
var Group = /*#__PURE__*/ function() {
    "use strict";
    function Group() {
        swcHelpers.classCallCheck(this, Group);
        this.d = 'no';
    }
    swcHelpers.createClass(Group, [
        {
            /**
     * @param {any} x
     * @return {false}
     */ key: "isInit",
            value: function isInit(x) {
                return false;
            }
        }
    ]);
    return Group;
}();
/** @param {Entry | Group} chunk */ function f(chunk) {
    var x = chunk.isInit(chunk) ? chunk.c : chunk.d;
    return x;
}
/**
 * @param {any} value
 * @return {value is boolean}
 */ function isBoolean(value) {
    return typeof value === "boolean";
}
/** @param {boolean | number} val */ function foo(val) {
    if (isBoolean(val)) {
        val;
    }
}
/**
 * @callback Cb
 * @param {unknown} x
 * @return {x is number}
 */ /** @type {Cb} */ function isNumber(x) {
    return typeof x === "number";
}
/** @param {unknown} x */ function g(x) {
    if (isNumber(x)) {
        x * 2;
    }
}
