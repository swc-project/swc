//// [controlFlowSuperPropertyAccess.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    var _proto = C.prototype;
    _proto.body = function body() {
        _get(_get_prototype_of(C.prototype), "m", this) && _get(_get_prototype_of(C.prototype), "m", this).call(this);
    };
    return C;
}(B);
