//// [instancePropertyInClassType.ts]
var NonGeneric, Generic, c, r, c1, r1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
NonGeneric || (NonGeneric = {}), (r = (c = new (/*#__PURE__*/ function() {
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
}())(1, 2)).fn()).x, r.y, r.y = 4, c.y(), Generic || (Generic = {}), (r1 = (c1 = new (/*#__PURE__*/ function() {
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
}())(1, '')).fn()).x, r1.y, r1.y = '', c1.y();
