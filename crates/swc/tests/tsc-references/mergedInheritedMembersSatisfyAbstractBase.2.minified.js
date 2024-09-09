//// [mergedInheritedMembersSatisfyAbstractBase.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
new (/*#__PURE__*/ function(BaseClass) {
    function Broken() {
        return _class_call_check(this, Broken), _call_super(this, Broken, arguments);
    }
    return _inherits(Broken, BaseClass), Broken;
}(function BaseClass() {
    _class_call_check(this, BaseClass);
}))().bar;
