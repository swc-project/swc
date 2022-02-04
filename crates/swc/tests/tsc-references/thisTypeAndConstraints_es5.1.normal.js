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
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    _createClass(A, [
        {
            key: "self",
            value: function self() {
                return this;
            }
        }
    ]);
    return A;
}();
function f(x1) {
    var g = function g(x) {
        x = x.self();
    };
    x1 = x1.self();
}
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _classCallCheck(this, B);
    }
    _createClass(B, [
        {
            key: "foo",
            value: function foo(x) {
                x = x.self();
            }
        },
        {
            key: "bar",
            value: function bar(x) {
                x = x.self();
            }
        }
    ]);
    return B;
}();
