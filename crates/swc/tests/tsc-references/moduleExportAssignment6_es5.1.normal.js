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
var C = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: webpackLibNormalModule.js
/*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        _classCallCheck(this, C);
        this.x = x;
        this.exports = [
            x
        ];
    }
    _createClass(C, [
        {
            /** @param {number} y */ key: "m",
            value: function m(y) {
                return this.x + y;
            }
        }
    ]);
    return C;
}();
function exec() {
    var module = new C(12);
    return module.exports; // should be fine because `module` is defined locally
}
function tricky() {
    // (a trickier variant of what webpack does)
    var module = new C(12);
    return function() {
        return module.exports;
    };
}
