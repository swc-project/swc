//// [propertyOverridesAccessors4.ts]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Lion = /*#__PURE__*/ function(Animal1) {
    "use strict";
    _inherits(Lion, Animal1);
    var _super = _create_super(Lion);
    function Lion() {
        _class_call_check(this, Lion);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "sound", 'RAWR!' // error here
        );
        return _this;
    }
    return Lion;
}(Animal);
