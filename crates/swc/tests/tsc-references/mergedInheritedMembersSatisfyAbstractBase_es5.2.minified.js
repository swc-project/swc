import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var BaseClass = function() {
    "use strict";
    _class_call_check(this, BaseClass);
}, Broken = function(BaseClass1) {
    "use strict";
    _inherits(Broken, BaseClass1);
    var _super = _create_super(Broken);
    function Broken() {
        return _class_call_check(this, Broken), _super.apply(this, arguments);
    }
    return Broken;
}(BaseClass);
new Broken().bar;
var IncorrectlyExtends = function(BaseClass2) {
    "use strict";
    _inherits(IncorrectlyExtends, BaseClass2);
    var _super = _create_super(IncorrectlyExtends);
    function IncorrectlyExtends() {
        return _class_call_check(this, IncorrectlyExtends), _super.apply(this, arguments);
    }
    return IncorrectlyExtends;
}(BaseClass);
