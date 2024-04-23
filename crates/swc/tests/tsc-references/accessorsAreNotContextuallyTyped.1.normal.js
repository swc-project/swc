//// [accessorsAreNotContextuallyTyped.ts]
// accessors are not contextually typed
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: "x",
            get: function get() {
                return function(x) {
                    return "";
                };
            },
            set: function set(v) {}
        }
    ]);
    return C;
}();
var c;
var r = c.x(''); // string
