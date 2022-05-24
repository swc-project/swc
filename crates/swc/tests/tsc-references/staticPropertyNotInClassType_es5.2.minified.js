var NonGeneric, Generic;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
!function(NonGeneric) {
    var C = function() {
        "use strict";
        function C(a, b) {
            _class_call_check(this, C), this.a = a, this.b = b;
        }
        return C.prototype.fn = function() {
            return this;
        }, _create_class(C, null, [
            {
                key: "x",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            }
        ]), C;
    }();
    (C || (C = {})).bar = "";
    var c = new C(1, 2);
    c.fn(), c.foo, c.bar, c.x;
}(NonGeneric || (NonGeneric = {})), function(Generic) {
    var C = function() {
        "use strict";
        function C(a, b) {
            _class_call_check(this, C), this.a = a, this.b = b;
        }
        return C.prototype.fn = function() {
            return this;
        }, _create_class(C, null, [
            {
                key: "x",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            }
        ]), C;
    }();
    (C || (C = {})).bar = "";
    var c = new C(1, "");
    c.fn(), c.foo, c.bar, c.x;
}(Generic || (Generic = {}));
