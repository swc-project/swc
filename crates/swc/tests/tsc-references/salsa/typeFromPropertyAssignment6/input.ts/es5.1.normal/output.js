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
var Outer = function Outer() {
    "use strict";
    _classCallCheck(this, Outer);
};
// @Filename: a.js
Outer.Inner = /*#__PURE__*/ (function() {
    "use strict";
    function I() {
        _classCallCheck(this, I);
    }
    _createClass(I, [
        {
            key: "messages",
            value: function messages() {
                return [];
            }
        }
    ]);
    return I;
})();
/** @type {!Outer.Inner} */ Outer.i;
// @Filename: b.js
var msgs = Outer.i.messages();
/** @param {Outer.Inner} inner */ function x(inner) {
}
