import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: esnext
// @noImplicitAny: true
// @declaration: true
// @outDir: out
// @Filename: jsDeclarationsClassMethod.js
function C1() {
    /**
     * A comment prop
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */ this.prop = function(x, y) {
        return x + y;
    };
}
/**
 * A comment method
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */ C1.prototype.method = function(x, y) {
    return x + y;
};
/**
 * A comment staticProp
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */ C1.staticProp = function(x, y) {
    return x + y;
};
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    swcHelpers.createClass(C2, [
        {
            /**
     * A comment method1
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */ key: "method1",
            value: function method1(x, y) {
                return x + y;
            }
        }
    ]);
    return C2;
}();
/**
 * A comment method2
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */ C2.prototype.method2 = function(x, y) {
    return x + y;
};
/**
 * A comment staticProp
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */ C2.staticProp = function(x, y) {
    return x + y;
};
