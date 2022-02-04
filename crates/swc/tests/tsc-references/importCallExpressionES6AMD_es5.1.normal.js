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
// @module: amd
// @target: es6
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
import("./0");
var p1 = import("./0");
p1.then(function(zero) {
    return zero.foo();
});
export var p2 = import("./0");
function foo() {
    var p2 = import("./0");
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "method",
            value: function method() {
                var loadAsync = import("./0");
            }
        }
    ]);
    return C;
}();
export var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    _createClass(D, [
        {
            key: "method",
            value: function method() {
                var loadAsync = import("./0");
            }
        }
    ]);
    return D;
}();
