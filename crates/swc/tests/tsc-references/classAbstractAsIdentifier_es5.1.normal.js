import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var abstract = /*#__PURE__*/ function() {
    "use strict";
    function abstract() {
        _class_call_check(this, abstract);
    }
    var _proto = abstract.prototype;
    _proto.foo = function foo() {
        return 1;
    };
    return abstract;
}();
new abstract;
