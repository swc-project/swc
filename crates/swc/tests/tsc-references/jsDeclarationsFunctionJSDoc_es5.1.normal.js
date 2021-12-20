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
 */ export function foo(a, b) {
}
/**
 * Legacy - DO NOT USE
 */ export var Aleph = /*#__PURE__*/ function() {
    "use strict";
    function Aleph(a, b) {
        _classCallCheck(this, Aleph);
        /**
         * Field is always null
         */ this.field = b;
    }
    _createClass(Aleph, [
        {
            /**
     * Doesn't actually do anything
     * @returns {void}
     */ key: "doIt",
            value: function doIt() {
            }
        }
    ]);
    return Aleph;
}();
/**
 * Not the speed of light
 */ export var c = 12;
