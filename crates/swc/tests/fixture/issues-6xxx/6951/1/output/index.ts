import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    _define_property(this, "a", true);
    _define_property(this, "b", false);
};
_define_property(A, "c", 1);
_ts_decorate([
    observable
], A.prototype, "a", void 0);
_ts_decorate([
    foo
], A, "c", void 0);
