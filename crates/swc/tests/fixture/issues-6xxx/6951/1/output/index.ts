import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    this.a = true;
    this.b = false;
};
A.c = 1;
_ts_decorate([
    observable
], A.prototype, "a", void 0);
_ts_decorate([
    foo
], A, "c", void 0);
