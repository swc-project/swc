//// [mergedInheritedMembersSatisfyAbstractBase.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
new (function(BaseClass) {
    _inherits(Broken, BaseClass);
    var _super = _create_super(Broken);
    function Broken() {
        return _class_call_check(this, Broken), _super.apply(this, arguments);
    }
    return Broken;
}(function BaseClass() {
    _class_call_check(this, BaseClass);
}))().bar;
