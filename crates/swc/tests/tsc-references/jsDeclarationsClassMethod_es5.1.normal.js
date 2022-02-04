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
        _classCallCheck(this, C2);
    }
    _createClass(C2, [
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
