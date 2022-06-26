import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var BaseClass = function BaseClass() {
    "use strict";
    _class_call_check(this, BaseClass);
};
var Broken = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    _inherits(Broken, BaseClass);
    var _super = _create_super(Broken);
    function Broken() {
        _class_call_check(this, Broken);
        return _super.apply(this, arguments);
    }
    return Broken;
}(BaseClass);
new Broken().bar;
var IncorrectlyExtends = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    _inherits(IncorrectlyExtends, BaseClass);
    var _super = _create_super(IncorrectlyExtends);
    function IncorrectlyExtends() {
        _class_call_check(this, IncorrectlyExtends);
        return _super.apply(this, arguments);
    }
    return IncorrectlyExtends;
}(BaseClass);
