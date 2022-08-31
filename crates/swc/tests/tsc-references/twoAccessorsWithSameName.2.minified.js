//// [twoAccessorsWithSameName.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: "x",
            get: function() {
                return 1;
            }
        }
    ]), C;
}();
var _obj, _mutatorMap = {};
_obj = {
    get x () {
        return 1;
    }
}, _mutatorMap.x = _mutatorMap.x || {}, _mutatorMap.x.get = function() {
    return 1;
}, _define_enumerable_properties(_obj, _mutatorMap);
