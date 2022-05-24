import _define_property from "@swc/helpers/lib/_define_property.js";
var ref = function() {
    var _obj;
    return _define_property(_obj = {}, "a", 1), _define_property(_obj, "b", 1), _obj;
}(), aVal = ref.a, bVal = ref.b;
console.log(aVal, bVal);
