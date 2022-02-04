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
// @module: es2020
// @target: es2020
// @filename: 0.ts
export var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _classCallCheck(this, B);
    }
    _createClass(B, [
        {
            key: "print",
            value: function print() {
                return "I am B";
            }
        }
    ]);
    return B;
}();
// @filename: 2.ts
function foo(x) {
    x.then(function(value) {
        var b = new value.B();
        b.print();
    });
}
foo(import("./0"));
