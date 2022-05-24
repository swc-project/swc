import _define_enumerable_properties from "@swc/helpers/lib/_define_enumerable_properties.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
var _obj, _mutatorMap = {};
// @target: es6
// @sourceMap: true
var v = (_obj = {}, _define_property(_obj, "hello", function() {
    debugger;
}), _mutatorMap["goodbye"] = _mutatorMap["goodbye"] || {}, _mutatorMap["goodbye"].get = function() {
    return 0;
}, _define_enumerable_properties(_obj, _mutatorMap), _obj);
