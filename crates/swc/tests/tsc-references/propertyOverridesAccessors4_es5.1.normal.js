import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Lion = /*#__PURE__*/ function(Animal1) {
    "use strict";
    _inherits(Lion, Animal1);
    var _super = _create_super(Lion);
    function Lion() {
        _class_call_check(this, Lion);
        var _this;
        _this = _super.apply(this, arguments);
        _this.sound = "RAWR!" // error here
        ;
        return _this;
    }
    return Lion;
}(Animal);
