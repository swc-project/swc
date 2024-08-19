//// [staticPropertyNotInClassType.ts]
var NonGeneric, Generic, C, c, C1, c1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
NonGeneric || (NonGeneric = {}), ((C = /*#__PURE__*/ function() {
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
}()) || (C = {})).bar = '', (c = new C(1, 2)).fn(), c.foo, c.bar, c.x, Generic || (Generic = {}), ((C1 = /*#__PURE__*/ function() {
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
}()) || (C1 = {})).bar = '', (c1 = new C1(1, '')).fn(), c1.foo, c1.bar, c1.x;
