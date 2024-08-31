//// [override10.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Sub = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Sub, Base);
    function Sub() {
        _class_call_check(this, Sub);
        return _call_super(this, Sub, arguments);
    }
    var _proto = Sub.prototype;
    _proto.bar = function bar() {};
    return Sub;
}(Base);
