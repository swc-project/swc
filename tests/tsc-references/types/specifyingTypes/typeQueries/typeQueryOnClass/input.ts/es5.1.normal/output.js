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
    function C(x) {
        var _this = this;
        _classCallCheck(this, C);
        this.x = x;
        this.ia = 1;
        this.ib = function() {
            return _this.ia;
        };
    }
    _createClass(C, [
        {
            key: "baz",
            value: function baz(x) {
                return '';
            }
        },
        {
            key: "ic",
            get: function get() {
                return 1;
            },
            set: function set(x) {
            }
        },
        {
            key: "id",
            get: function get() {
                return 1;
            }
        }
    ], [
        {
            key: "foo",
            value: function foo(x) {
            }
        },
        {
            key: "bar",
            value: function bar(x) {
            }
        },
        {
            key: "sc",
            get: function get() {
                return 1;
            },
            set: function set(x) {
            }
        },
        {
            key: "sd",
            get: function get() {
                return 1;
            }
        }
    ]);
    return C;
}();
C.sa = 1;
C.sb = function() {
    return 1;
};
var c;
// BUG 820454
var r1;
var r2;
var D = /*#__PURE__*/ function() {
    "use strict";
    function D(y) {
        _classCallCheck(this, D);
        this.y = y;
    }
    _createClass(D, [
        {
            key: "foo",
            value: function foo() {
            }
        }
    ]);
    return D;
}();
var d;
var r3;
var r4;
