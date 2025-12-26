//// [classWithStaticFieldInParameterInitializer.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var _this = this;
var __ = new WeakMap(), _class;
// https://github.com/microsoft/TypeScript/issues/36295
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (_class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, __.set(_class, {
        writable: true,
        value: _this.x = 1
    }), _class);
})();
