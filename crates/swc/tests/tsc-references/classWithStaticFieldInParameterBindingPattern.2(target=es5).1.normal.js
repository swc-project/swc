//// [classWithStaticFieldInParameterBindingPattern.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var _class, _class1;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function(param) {
    var tmp = param[/*#__PURE__*/ (_class = function(C) {
        "use strict";
        _inherits(_class, C);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(C), _class.x = 1, _class).x], b = tmp === void 0 ? "" : tmp;
    var C1;
})();
var x = "";
(function(param) {
    var tmp = param[/*#__PURE__*/ (_class1 = function(C) {
        "use strict";
        _inherits(_class, C);
        var _super = _create_super(_class);
        function _class() {
            _class_call_check(this, _class);
            return _super.apply(this, arguments);
        }
        return _class;
    }(C), _class1.x = 1, _class1).x], b = tmp === void 0 ? "" : tmp, d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    var x1;
})();
