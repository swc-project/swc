import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return this.foo;
    }, _proto.bar = function() {
        var C2 = function() {
            function C2() {
                _class_call_check(this, C2);
            }
            return C2.prototype.foo = function() {
                x.foo, x.bar, x.x, x.y, C.x, C.y, C.bar, C.foo;
                var x, y = new C();
                y.foo, y.bar, y.x, y.y;
            }, C2;
        }();
    }, C.foo = function() {
        return this.foo;
    }, C.bar = function() {
        this.foo();
    }, _create_class(C, [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        }
    ], [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        }
    ]), C;
}();
