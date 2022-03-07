import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return this.foo;
    }, _proto.bar = function() {
        var C2 = function() {
            function C2() {
                swcHelpers.classCallCheck(this, C2);
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
    }, swcHelpers.createClass(C, [
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
