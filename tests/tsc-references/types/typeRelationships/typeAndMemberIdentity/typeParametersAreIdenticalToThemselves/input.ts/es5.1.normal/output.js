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
function foo1(x) {
}
function foo2(x) {
}
function foo3(x, y) {
    var inner = function inner(x) {
    };
    var inner2 = function inner2(x) {
    };
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "foo1",
            value: function foo1(x) {
            }
        },
        {
            key: "foo2",
            value: function foo2(a, x) {
            }
        },
        {
            key: "foo3",
            value: function foo3(x) {
            }
        },
        {
            key: "foo4",
            value: function foo4(x) {
            }
        }
    ]);
    return C;
}();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    _createClass(C2, [
        {
            key: "foo1",
            value: function foo1(x) {
            }
        },
        {
            key: "foo2",
            value: function foo2(a, x) {
            }
        },
        {
            key: "foo3",
            value: function foo3(x) {
            }
        }
    ]);
    return C2;
}();
