//// [staticPropertyNotInClassType.ts]
var NonGeneric, Generic, C, C1, c, C2, C3, c1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
NonGeneric || (NonGeneric = {}), C1 = (C = function() {
    function C(a, b) {
        _class_call_check(this, C), this.a = a, this.b = b;
    }
    var _proto = C.prototype;
    return _proto.fn = function() {
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
}()) || (C = {}), C1.bar = "", (c = new C(1, 2)).fn(), c.foo, c.bar, c.x, Generic || (Generic = {}), C3 = (C2 = function() {
    function C(a, b) {
        _class_call_check(this, C), this.a = a, this.b = b;
    }
    var _proto = C.prototype;
    return _proto.fn = function() {
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
}()) || (C2 = {}), C3.bar = "", (c1 = new C2(1, "")).fn(), c1.foo, c1.bar, c1.x;
