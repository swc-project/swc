//// [instancePropertiesInheritedIntoClassType.ts]
var NonGeneric, Generic, d, r, d1, r1;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
NonGeneric || (NonGeneric = {}), (r = (d = new (/*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(/*#__PURE__*/ function() {
    function C(a, b) {
        _class_call_check(this, C), this.a = a, this.b = b;
    }
    return C.prototype.fn = function() {
        return this;
    }, _create_class(C, [
        {
            key: "y",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), C;
}()))(1, 2)).fn()).x, r.y, r.y = 4, d.y(), Generic || (Generic = {}), (r1 = (d1 = new (/*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(/*#__PURE__*/ function() {
    function C(a, b) {
        _class_call_check(this, C), this.a = a, this.b = b;
    }
    return C.prototype.fn = function() {
        return this;
    }, _create_class(C, [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(v) {}
        }
    ]), C;
}()))(1, '')).fn()).x, r1.y, r1.y = '', d1.y();
