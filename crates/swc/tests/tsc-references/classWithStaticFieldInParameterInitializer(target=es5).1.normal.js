//// [classWithStaticFieldInParameterInitializer.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _class;
// https://github.com/microsoft/TypeScript/issues/36295
(function() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : (_class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, _class.x = 1, _class);
})();
