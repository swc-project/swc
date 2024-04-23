//// [bug25127.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Entry = /*#__PURE__*/ function() {
    "use strict";
    function Entry() {
        _class_call_check(this, Entry);
        this.c = 1;
    }
    var _proto = Entry.prototype;
    /**
     * @param {any} x
     * @return {this is Entry}
     */ _proto.isInit = function isInit(x) {
        return true;
    };
    return Entry;
}();
var Group = /*#__PURE__*/ function() {
    "use strict";
    function Group() {
        _class_call_check(this, Group);
        this.d = 'no';
    }
    var _proto = Group.prototype;
    /**
     * @param {any} x
     * @return {false}
     */ _proto.isInit = function isInit(x) {
        return false;
    };
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
