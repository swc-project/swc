import * as swcHelpers from "@swc/helpers";
var ref = function() {
    var _obj;
    return _obj = {}, swcHelpers.defineProperty(_obj, "a", 1), swcHelpers.defineProperty(_obj, "b", 1), _obj;
}(), aVal = ref.a, bVal = ref.b;
console.log(aVal, bVal);
