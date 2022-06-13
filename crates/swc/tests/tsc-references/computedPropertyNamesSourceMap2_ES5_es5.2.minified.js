import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _obj, _mutatorMap = {};
_define_property(_obj = {}, "hello", function() {}), _mutatorMap.goodbye = _mutatorMap.goodbye || {}, _mutatorMap.goodbye.get = function() {
    return 0;
}, _define_enumerable_properties(_obj, _mutatorMap);
