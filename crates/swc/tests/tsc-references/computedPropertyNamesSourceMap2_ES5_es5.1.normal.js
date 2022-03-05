import * as swcHelpers from "@swc/helpers";
var _obj, _mutatorMap = {};
// @target: es5
// @sourceMap: true
var v = (_obj = {}, swcHelpers.defineProperty(_obj, "hello", function() {
    debugger;
}), _mutatorMap["goodbye"] = _mutatorMap["goodbye"] || {}, _mutatorMap["goodbye"].get = function() {
    return 0;
}, swcHelpers.defineEnumerableProperties(_obj, _mutatorMap), _obj);
