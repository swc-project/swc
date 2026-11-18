var _tagged_template_literal = require("@swc/helpers/_/_tagged_template_literal");
function _templateObject() {
    var data = _tagged_template_literal._([
        "abc"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
if (10 === a) {}
if ('a' === a) {
    if ("abc" === a) {}
}
if (-10 === a) {}
if (10 < a && a > 30) {}
if (c && 10 < a && a > 30) {}
// wait for rule "radix" merge
if (String.raw(_templateObject()) === a) {}
// Valid cases
if (a === 10) {}
if ("".concat(y) === a) {}
if (f() === a) {}
if (foo === 1 && 1 === foo) {}
