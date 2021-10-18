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
// @noEmit: true
// @Filename: test.js
function f(x) {
}
f(); // Always been ok
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        this.p = function(x) {
        };
    }
    _createClass(C, [
        {
            key: "m",
            value: function m(x) {
            }
        }
    ], [
        {
            key: "m",
            value: function m(x) {
            }
        }
    ]);
    return C;
}();
C.m(); // Always been ok
new C().m(); // Regression #39261
new C().p(); // Regression #39261
var obj = {
    m: function(x) {
    },
    p: function(x) {
    }
};
obj.m(); // Always been ok
obj.p(); // Always been ok
