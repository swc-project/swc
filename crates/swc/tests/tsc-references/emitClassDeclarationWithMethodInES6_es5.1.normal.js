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
var tmp = "computedName1", tmp1 = "computedName2", tmp2 = "computedName3", tmp3 = "computedname4", tmp4 = "computedname5", tmp5 = "computedname6";
var D = // @target:es6
/*#__PURE__*/ function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    _createClass(D, [
        {
            key: "foo",
            value: function foo() {
            }
        },
        {
            key: tmp,
            value: function value() {
            }
        },
        {
            key: tmp1,
            value: function value(a) {
            }
        },
        {
            key: tmp2,
            value: function value(a) {
                return 1;
            }
        },
        {
            key: "bar",
            value: function bar() {
                return this._bar;
            }
        },
        {
            key: "baz",
            value: function baz(a, x) {
                return "HELLO";
            }
        }
    ], [
        {
            key: tmp3,
            value: function value() {
            }
        },
        {
            key: tmp4,
            value: function value(a) {
            }
        },
        {
            key: tmp5,
            value: function value(a) {
                return true;
            }
        },
        {
            key: "staticMethod",
            value: function staticMethod() {
                var x = 1 + 2;
                return x;
            }
        },
        {
            key: "foo",
            value: function foo(a) {
            }
        },
        {
            key: "bar",
            value: function bar(a) {
                return 1;
            }
        }
    ]);
    return D;
}();
