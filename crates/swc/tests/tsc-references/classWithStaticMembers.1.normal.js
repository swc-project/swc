//// [classWithStaticMembers.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(a, b) {
        _class_call_check(this, C);
        this.a = a;
        this.b = b;
    }
    C.fn = function fn() {
        return this;
    };
    _create_class(C, null, [
        {
            key: "x",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return C;
}();
var r = C.fn();
var r2 = r.x;
var r3 = r.foo;
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(C);
var r = D.fn();
var r2 = r.x;
var r3 = r.foo;
