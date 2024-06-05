//// [instancePropertiesInheritedIntoClassType.ts]
var d, r, d1, r1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
(r = (d = new (function(C) {
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(function() {
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
}()))(1, 2)).fn()).x, r.y, r.y = 4, d.y(), (r1 = (d1 = new (function(C) {
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(function() {
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
