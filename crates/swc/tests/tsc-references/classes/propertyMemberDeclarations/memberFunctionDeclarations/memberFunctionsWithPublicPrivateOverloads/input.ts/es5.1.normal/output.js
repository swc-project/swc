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
            key: "bar",
            value: function bar(x, y) {
            }
        },
        {
            key: "baz",
            value: function baz(x, y) {
            }
        }
    ], [
        {
            key: "foo",
            value: function foo(x, y) {
            }
        },
        {
            key: "bar",
            value: function bar(x, y) {
            }
        },
        {
            key: "baz",
            value: function baz(x, y) {
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    _createClass(D, [
        {
            key: "foo",
            value: function foo(x, y) {
            }
        },
        {
            key: "bar",
            value: function bar(x, y) {
            }
        },
        {
            key: "baz",
            value: function baz(x, y) {
            }
        }
    ], [
        {
            key: "foo",
            value: function foo(x, y) {
            }
        },
        {
            key: "bar",
            value: function bar(x, y) {
            }
        },
        {
            key: "baz",
            value: function baz(x, y) {
            }
        }
    ]);
    return D;
}();
var c;
var r = c.foo(1); // error
var d;
var r2 = d.foo(2); // error
