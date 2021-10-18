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
// Call signature parameters do not allow accessibility modifiers
function foo(x, y) {
}
var f = function foo(x, y) {
};
var f2 = function f2(x, y) {
};
var f3 = function(x, y) {
};
var f4 = function(x, y) {
};
function foo2(x, y) {
}
var f5 = function foo(x, y) {
};
var f6 = function f6(x, y) {
};
var f7 = function(x, y) {
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
            value: function foo(x, y) {
            }
        },
        {
            key: "foo2",
            value: function foo2(x, y) {
            }
        },
        {
            key: "foo3",
            value: function foo3(x, y) {
            }
        }
    ]);
    return C;
}();
var a;
var b = {
    foo: function(x, y) {
    },
    a: function foo(x, y) {
    },
    b: function(x, y) {
    }
};
