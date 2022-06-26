import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: source.js
/**
 * Foos a bar together using an `a` and a `b`
 * @param {number} a
 * @param {string} b
 */ export function foo(a, b) {}
/**
 * Legacy - DO NOT USE
 */ export var Aleph = /*#__PURE__*/ function() {
    "use strict";
    function Aleph(a, b) {
        _class_call_check(this, Aleph);
        /**
         * Field is always null
         */ this.field = b;
    }
    var _proto = Aleph.prototype;
    /**
     * Doesn't actually do anything
     * @returns {void}
     */ _proto.doIt = function doIt() {};
    return Aleph;
}();
/**
 * Not the speed of light
 */ export var c = 12;
