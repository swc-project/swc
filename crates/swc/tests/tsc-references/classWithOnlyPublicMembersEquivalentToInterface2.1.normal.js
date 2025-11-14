//// [classWithOnlyPublicMembersEquivalentToInterface2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
// no errors expected
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.y = function y(a) {
        return null;
    };
    _create_class(C, [
        {
            key: "z",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return C;
}();
var c;
var i;
c = i;
i = c;
