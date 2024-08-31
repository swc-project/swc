//// [superCallParameterContextualTyping3.ts]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var CBase = /*#__PURE__*/ function() {
    "use strict";
    function CBase(param) {
        _class_call_check(this, CBase);
    }
    var _proto = CBase.prototype;
    _proto.foo = function foo(param) {};
    return CBase;
}();
var C = /*#__PURE__*/ function(CBase) {
    "use strict";
    _inherits(C, CBase);
    function C() {
        _class_call_check(this, C);
        var _this;
        // Should be okay.
        // 'p' should have type 'string'.
        _this = _call_super(this, C, [
            {
                method: function method(p) {
                    p.length;
                }
            }
        ]);
        // Should be okay.
        // 'p' should have type 'string'.
        _get((_assert_this_initialized(_this), _get_prototype_of(C.prototype)), "foo", _this).call(_this, {
            method: function method(p) {
                p.length;
            }
        });
        return _this;
    }
    return C;
}(CBase);
