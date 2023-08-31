Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Base", {
    enumerable: true,
    get: function() {
        return Base;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check._(this, Base);
    }
    _create_class._(Base, [
        {
            key: "foo",
            value: function foo() {
                return 2;
            }
        }
    ]);
    return Base;
}();
