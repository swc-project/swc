//// [jsDeclarationsTypedefAndLatebound.ts]
//// [index.js]
require("./LazySet"), (void 0).addAll(void 0);
//// [LazySet.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var LazySet = /*#__PURE__*/ function() {
    function LazySet() {
        _class_call_check(this, LazySet);
    }
    var _proto = LazySet.prototype;
    return _proto.addAll = function(iterable) {}, _proto[Symbol.iterator] = function() {}, LazySet;
}();
module.exports = LazySet;
