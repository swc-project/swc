//// [propertyOverridesAccessors4.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Lion = /*#__PURE__*/ function(Animal1) {
    "use strict";
    _inherits(Lion, Animal1);
    function Lion() {
        _class_call_check(this, Lion);
        var _this;
        _this = _call_super(this, Lion, arguments), _define_property(_this, "sound", 'RAWR!' // error here
        );
        return _this;
    }
    return Lion;
}(Animal);
