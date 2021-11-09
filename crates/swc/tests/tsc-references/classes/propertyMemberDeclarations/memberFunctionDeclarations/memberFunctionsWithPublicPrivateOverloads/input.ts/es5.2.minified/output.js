function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var c, d, C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, [
        {
            key: "foo",
            value: function(x, y) {
            }
        },
        {
            key: "bar",
            value: function(x, y) {
            }
        },
        {
            key: "baz",
            value: function(x, y) {
            }
        }
    ], [
        {
            key: "foo",
            value: function(x, y) {
            }
        },
        {
            key: "bar",
            value: function(x, y) {
            }
        },
        {
            key: "baz",
            value: function(x, y) {
            }
        }
    ]), C;
}(), D = function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    return _createClass(D, [
        {
            key: "foo",
            value: function(x, y) {
            }
        },
        {
            key: "bar",
            value: function(x, y) {
            }
        },
        {
            key: "baz",
            value: function(x, y) {
            }
        }
    ], [
        {
            key: "foo",
            value: function(x, y) {
            }
        },
        {
            key: "bar",
            value: function(x, y) {
            }
        },
        {
            key: "baz",
            value: function(x, y) {
            }
        }
    ]), D;
}();
c.foo(1), d.foo(2);
