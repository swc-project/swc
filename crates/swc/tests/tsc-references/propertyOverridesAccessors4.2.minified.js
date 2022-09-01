//// [propertyOverridesAccessors4.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Animal1) {
    "use strict";
    _inherits(Lion, Animal1);
    var _super = _create_super(Lion);
    function Lion() {
        var _this;
        return _class_call_check(this, Lion), _this = _super.apply(this, arguments), _define_property(_assert_this_initialized(_this), "sound", "RAWR!"), _this;
    }
    return Lion;
}(Animal);
