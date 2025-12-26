//// [classWithStaticFieldInParameterInitializer.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var _class, _this = this, __ = new WeakMap();
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : (_class = function _class() {
        _class_call_check(this, _class);
    }, __.set(_class, {
        writable: !0,
        value: _this.x = 1
    }));
}();
