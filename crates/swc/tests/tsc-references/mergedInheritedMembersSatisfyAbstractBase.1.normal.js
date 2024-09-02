//// [mergedInheritedMembersSatisfyAbstractBase.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var BaseClass = function BaseClass() {
    "use strict";
    _class_call_check(this, BaseClass);
};
var Broken = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    _inherits(Broken, BaseClass);
    function Broken() {
        _class_call_check(this, Broken);
        return _call_super(this, Broken, arguments);
    }
    return Broken;
}(BaseClass);
new Broken().bar;
var IncorrectlyExtends = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    _inherits(IncorrectlyExtends, BaseClass);
    function IncorrectlyExtends() {
        _class_call_check(this, IncorrectlyExtends);
        return _call_super(this, IncorrectlyExtends, arguments);
    }
    return IncorrectlyExtends;
}(BaseClass);
