//// [classWithStaticFieldInParameterBindingPattern.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var _class;
// https://github.com/microsoft/TypeScript/issues/36295
(function(param) {
    var tmp = param[(_class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, function() {
        _class.x = 1;
    }(), _class).x], b = tmp === void 0 ? "" : tmp;
})();
