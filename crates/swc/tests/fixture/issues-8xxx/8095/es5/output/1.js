import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var _class;
var foo = _class = /*#__PURE__*/ function() {
    "use strict";
    function __class() {
        _class_call_check(this, __class);
    }
    _create_class(__class, [
        {
            key: "foo",
            value: function foo(v) {
                return v;
            }
        }
    ]);
    return __class;
}();
_ts_decorate([
    foo
], _class.prototype, "foo", null);
