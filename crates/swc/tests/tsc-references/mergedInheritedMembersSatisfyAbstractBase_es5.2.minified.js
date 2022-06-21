import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var BaseClass = function() {
    "use strict";
    _class_call_check(this, BaseClass);
}, Broken = function(BaseClass) {
    "use strict";
    _inherits(Broken, BaseClass);
    var _super = _create_super(Broken);
    function Broken() {
        return _class_call_check(this, Broken), _super.apply(this, arguments);
    }
    return Broken;
}(BaseClass);
new Broken().bar;
var IncorrectlyExtends = function(BaseClass) {
    "use strict";
    _inherits(IncorrectlyExtends, BaseClass);
    var _super = _create_super(IncorrectlyExtends);
    function IncorrectlyExtends() {
        return _class_call_check(this, IncorrectlyExtends), _super.apply(this, arguments);
    }
    return IncorrectlyExtends;
}(BaseClass);
