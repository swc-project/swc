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
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
var Outer = /*#__PURE__*/ function() {
    "use strict";
    function O() {
        _classCallCheck(this, O);
    }
    _createClass(O, [
        {
            key: "m",
            value: function m(x, y) {
            }
        }
    ]);
    return O;
}();
Outer.Inner = /*#__PURE__*/ (function() {
    "use strict";
    function I() {
        _classCallCheck(this, I);
    }
    _createClass(I, [
        {
            key: "n",
            value: function n(a, b) {
            }
        }
    ]);
    return I;
})();
/** @type {Outer} */ var si;
si.m;
/** @type {Outer.Inner} */ var oi;
oi.n;
