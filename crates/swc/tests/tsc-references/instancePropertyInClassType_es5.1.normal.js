import * as swcHelpers from "@swc/helpers";
var NonGeneric;
(function(NonGeneric) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C);
            this.a = a;
            this.b = b;
        }
        var _proto = C.prototype;
        _proto.fn = function fn() {
            return this;
        };
        swcHelpers.createClass(C, [
            {
                key: "y",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    var c = new C(1, 2);
    var r = c.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = 4;
    var r6 = c.y(); // error
})(NonGeneric || (NonGeneric = {}));
var Generic;
(function(Generic) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C);
            this.a = a;
            this.b = b;
        }
        var _proto = C.prototype;
        _proto.fn = function fn() {
            return this;
        };
        swcHelpers.createClass(C, [
            {
                key: "y",
                get: function get() {
                    return null;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    var c = new C(1, "");
    var r = c.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = "";
    var r6 = c.y(); // error
})(Generic || (Generic = {}));
