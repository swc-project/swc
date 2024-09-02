//// [superCalls.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base(n) {
    "use strict";
    _class_call_check(this, Base);
    this.x = 43;
};
function v() {}
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived(q) {
        _class_call_check(this, Derived);
        var _this;
        _this = _call_super(this, Derived, [
            ''
        ]), _this.q = q;
        //type of super call expression is void
        var p = [
            _this = _call_super(this, Derived, [
                ''
            ]),
            _this.q = q
        ][0];
        var p = v();
        return _this;
    }
    return Derived;
}(Base);
var OtherBase = function OtherBase() {
    "use strict";
    _class_call_check(this, OtherBase);
};
var OtherDerived = /*#__PURE__*/ function(OtherBase) {
    "use strict";
    _inherits(OtherDerived, OtherBase);
    function OtherDerived() {
        _class_call_check(this, OtherDerived);
        var p = '';
        return _call_super(this, OtherDerived);
    }
    return OtherDerived;
}(OtherBase);
