import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Lion = /*#__PURE__*/ function(Animal) {
    "use strict";
    _inherits(Lion, Animal);
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
