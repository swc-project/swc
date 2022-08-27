//// [mergedInheritedMembersSatisfyAbstractBase.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
new (function(BaseClass) {
    "use strict";
    _inherits(Broken, BaseClass);
    var _super = _create_super(Broken);
    function Broken() {
        return _class_call_check(this, Broken), _super.apply(this, arguments);
    }
    return Broken;
}(function BaseClass() {
    "use strict";
    _class_call_check(this, BaseClass);
}))().bar;
