import _define_enumerable_properties from "@swc/helpers/lib/_define_enumerable_properties.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
var _obj, _mutatorMap = {};
//@target: ES6
var i = (_obj = {}, _define_property(_obj, Symbol.iterator, 0), _define_property(_obj, Symbol.toStringTag, function() {
    return "";
}), _mutatorMap[Symbol.toPrimitive] = _mutatorMap[Symbol.toPrimitive] || {}, _mutatorMap[Symbol.toPrimitive].set = function(p) {}, _define_enumerable_properties(_obj, _mutatorMap), _obj);
var it = i[Symbol.iterator];
var str = i[Symbol.toStringTag]();
i[Symbol.toPrimitive] = false;
