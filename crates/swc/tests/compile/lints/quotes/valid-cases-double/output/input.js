var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _define_property = require("@swc/helpers/_/_define_property");
// prettier-ignore
var s = 'double quotes string';
// valid cases
var foo = "bar";
var foo = 1;
var foo = '"';
// prettier-ignore
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check._(this, C);
        _define_property._(this, "f", void 0);
    }
    _create_class._(C, [
        {
            key: "m",
            value: function m() {}
        }
    ]);
    return C;
}();
