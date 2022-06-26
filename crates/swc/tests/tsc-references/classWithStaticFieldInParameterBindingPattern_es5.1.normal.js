import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _class;
// @target: esnext,es2015,es5
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/36295
(function(param) {
    var tmp = param[(_class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, _class.x = 1, _class).x], b = tmp === void 0 ? "" : tmp;
})();
