function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var Entry = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @lib: esnext
// @Filename: bug25127.js
/*#__PURE__*/ function() {
    "use strict";
    function Entry() {
        _classCallCheck(this, Entry);
        this.c = 1;
    }
    _createClass(Entry, [
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
        _classCallCheck(this, Group);
        this.d = 'no';
    }
    _createClass(Group, [
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
/** @type {Cb} */ /**
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
