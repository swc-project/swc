import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Lion = function(Animal) {
    "use strict";
    _inherits(Lion, Animal);
    var _super = _create_super(Lion);
    function Lion() {
        var _this;
        return _class_call_check(this, Lion), _this = _super.apply(this, arguments), _this.sound = "RAWR!", _this;
    }
    return Lion;
}(Animal);
