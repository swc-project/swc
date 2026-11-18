var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _define_property = require("@swc/helpers/_/_define_property");
var _tagged_template_literal = require("@swc/helpers/_/_tagged_template_literal");
function _templateObject() {
    var data = _tagged_template_literal._([
        "backtick"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var s = "double quotes string";
// valid cases
// prettier-ignore
var foo = 'bar';
var foo = 1;
var foo = "'";
// prettier-ignore
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check._(this, C);
        _define_property._(this, 'f', void 0);
    }
    _create_class._(C, [
        {
            key: 'm',
            value: function m() {}
        }
    ]);
    return C;
}();
var foo = "back\ntick";
var foo = "back\rtick";
var foo = "back\u2028tick";
var foo = "back\u2029tick";
var foo = "back\\\\\ntick";
var foo = "back\\\\\\\\\ntick";
var foo = "\n";
// prettier-ignore
var foo = "bar 'foo' baz" + 'bar';
var foo = "back".concat(x, "tick");
var foo = tag(_templateObject());
var foo = "bar 'foo' baz" + "bar";
