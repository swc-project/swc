//// [classWithStaticMembers.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function() {
    function C(a, b) {
        _class_call_check(this, C), this.a = a, this.b = b;
    }
    return C.fn = function() {
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
}(), r = C.fn();
r.x, r.foo;
var r = /*#__PURE__*/ (function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
})(C).fn();
r.x, r.foo;
