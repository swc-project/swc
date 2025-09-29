import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
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
