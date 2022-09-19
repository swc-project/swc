//// [twoAccessorsWithSameName.ts]
import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
var _mutatorMap = {};
_mutatorMap.x = _mutatorMap.x || {}, _mutatorMap.x.get = function() {
    return 1;
}, _define_enumerable_properties({
    get x () {
        return 1;
    }
}, _mutatorMap);
