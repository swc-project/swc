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
var // @declaration: true
// @target: es6
// constant enum declarations are completely erased in the emitted JavaScript code.
// it is an error to reference a constant enum object in any other context
// than a property access that selects one of the enum's members
G;
(function(G) {
    G[G["A"] = 1] = "A";
    G[G["B"] = 2] = "B";
    G[G["C"] = 3] = "C";
    G[G["D"] = 2] = "D";
})(G || (G = {}));
var o = {
    1: true
};
var a = 1;
var a1 = 1;
var g = o[1];
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: 1,
            value: function value() {}
        },
        {
            key: 2,
            get: function get() {
                return true;
            }
        },
        {
            key: 2,
            set: function set(x) {}
        }
    ]);
    return C;
}();
