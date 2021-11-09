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
// Duplicate parameter names are always an error
function foo(x, x) {
}
var f = function foo(x, x) {
};
var f2 = function f2(x, x) {
};
var f3 = function(x, x) {
};
var f4 = function(x, x) {
};
function foo2(x, x) {
}
var f5 = function foo(x, x) {
};
var f6 = function f6(x, x) {
};
var f7 = function(x, x) {
};
var f8 = function(x, y) {
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo(x, x) {
            }
        },
        {
            key: "foo2",
            value: function foo2(x, x) {
            }
        },
        {
            key: "foo3",
            value: function foo3(x, x) {
            }
        }
    ]);
    return C;
}();
var a;
var b = {
    foo: function(x, x) {
    },
    a: function foo(x, x) {
    },
    b: function(x, x) {
    }
};
