//// [computedPropertyNamesSourceMap1_ES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto["hello"] = function() {
        debugger;
    };
    _create_class(C, [
        {
            key: "goodbye",
            get: function get() {
                return 0;
            }
        }
    ]);
    return C;
}();
