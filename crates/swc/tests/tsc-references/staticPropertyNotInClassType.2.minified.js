//// [staticPropertyNotInClassType.ts]
var NonGeneric, Generic;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
!function(NonGeneric) {
    var C = function() {
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
