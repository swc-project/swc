import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var _class;
var foo = _class = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    _create_class(_class, [
        {
            key: "foo",
            value: function foo(v) {
                return v;
            }
        }
    ]);
    return _class;
}();
_ts_decorate([
    foo
], _class.prototype, "foo", null);
