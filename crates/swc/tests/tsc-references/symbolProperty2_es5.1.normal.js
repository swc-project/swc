import _define_enumerable_properties from "@swc/helpers/lib/_define_enumerable_properties.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
//@target: ES6
var s = Symbol();
var _obj, _mutatorMap = {};
var x = (_obj = {}, _define_property(_obj, s, 0), _define_property(_obj, s, function() {}), _mutatorMap[s] = _mutatorMap[s] || {}, _mutatorMap[s].get = function() {
    return 0;
}, _define_enumerable_properties(_obj, _mutatorMap), _obj);
