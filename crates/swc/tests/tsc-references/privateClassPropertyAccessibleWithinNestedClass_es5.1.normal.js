import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target: ES5
// no errors
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto1 = C.prototype;
    _proto1.foo = function foo() {
        return this.foo;
    };
    _proto1.bar = function bar() {
        var C2 = /*#__PURE__*/ function() {
            function C2() {
                _class_call_check(this, C2);
            }
            var _proto = C2.prototype;
            _proto.foo = function foo() {
                var x;
                var x1 = x.foo;
                var x2 = x.bar;
                var x3 = x.x;
                var x4 = x.y;
                var sx1 = C.x;
                var sx2 = C.y;
                var sx3 = C.bar;
                var sx4 = C.foo;
                var y = new C();
                var y1 = y.foo;
                var y2 = y.bar;
                var y3 = y.x;
                var y4 = y.y;
            };
            return C2;
        }();
    };
    C.foo = function foo() {
        return this.foo;
    };
    C.bar = function bar() {
        this.foo();
    };
    _create_class(C, [
        {
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
            }
        }
    ]);
    return C;
}();
