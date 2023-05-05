//// [classAbstractAsIdentifier.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
