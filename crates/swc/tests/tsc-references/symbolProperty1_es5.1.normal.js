import _define_enumerable_properties from "@swc/helpers/src/_define_enumerable_properties.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
//@target: ES6
var s;
var _obj, _mutatorMap = {};
var x = (_obj = {}, _define_property(_obj, s, 0), _define_property(_obj, s, function() {}), _mutatorMap[s] = _mutatorMap[s] || {}, _mutatorMap[s].get = function() {
    return 0;
}, _define_enumerable_properties(_obj, _mutatorMap), _obj);
