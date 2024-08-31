//// [classConstructorParametersAccessibility.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C1 = function C1(x) {
    "use strict";
    _class_call_check(this, C1);
    this.x = x;
};
var c1;
c1.x // OK
;
var C2 = function C2(p) {
    "use strict";
    _class_call_check(this, C2);
    this.p = p;
};
var c2;
c2.p // private, error
;
var C3 = function C3(p) {
    "use strict";
    _class_call_check(this, C3);
    this.p = p;
};
var c3;
c3.p // protected, error
;
var Derived = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(Derived, C3);
    function Derived(p) {
        _class_call_check(this, Derived);
        var _this;
        _this = _call_super(this, Derived, [
            p
        ]);
        _this.p; // OK
        return _this;
    }
    return Derived;
}(C3);
