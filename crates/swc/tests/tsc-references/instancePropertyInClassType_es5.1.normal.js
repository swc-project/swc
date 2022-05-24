import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var NonGeneric;
(function(NonGeneric) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            _class_call_check(this, C);
            this.a = a;
            this.b = b;
        }
        var _proto = C.prototype;
        _proto.fn = function fn() {
            return this;
        };
        _create_class(C, [
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
            _class_call_check(this, C);
            this.a = a;
            this.b = b;
        }
        var _proto = C.prototype;
        _proto.fn = function fn() {
            return this;
        };
        _create_class(C, [
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
