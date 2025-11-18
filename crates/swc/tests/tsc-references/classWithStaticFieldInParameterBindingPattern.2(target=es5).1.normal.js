//// [classWithStaticFieldInParameterBindingPattern.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _class, _class1;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function(param) {
    var tmp = param[(_class = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(_class, C);
        function _class() {
            _class_call_check(this, _class);
            return _call_super(this, _class, arguments);
        }
        return _class;
    }(C), _class.x = 1, _class).x], b = tmp === void 0 ? "" : tmp;
    var C1;
})();
var x = "";
(function(param) {
    var tmp = param[(_class1 = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(_class, C);
        function _class() {
            _class_call_check(this, _class);
            return _call_super(this, _class, arguments);
        }
        return _class;
    }(C), _class1.x = 1, _class1).x], b = tmp === void 0 ? "" : tmp, d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x;
    var x1;
})();
