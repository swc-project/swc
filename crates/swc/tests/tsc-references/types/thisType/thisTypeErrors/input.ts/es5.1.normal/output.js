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
var x1;
var x2;
var x3;
function f1(x) {
    var y;
    return this;
}
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    _createClass(C2, null, [
        {
            key: "foo",
            value: function foo(x) {
                return undefined;
            }
        }
    ]);
    return C2;
}();
C2.y = undefined;
var N1;
(function(N11) {
    var x;
    N11.y = this;
    N11.x = x;
})(N1 || (N1 = {
}));
var C3 = /*#__PURE__*/ function() {
    "use strict";
    function C3() {
        _classCallCheck(this, C3);
        this.x1 = {
            g: function g(x) {
                return undefined;
            }
        };
    }
    _createClass(C3, [
        {
            key: "f",
            value: function f() {
                var g = function g(x) {
                    return undefined;
                };
                var x2 = {
                    h: function h(x) {
                        return undefined;
                    }
                };
            }
        }
    ]);
    return C3;
}();
