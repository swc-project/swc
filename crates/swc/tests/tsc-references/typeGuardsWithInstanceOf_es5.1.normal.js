import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
var result;
var result2;
if (!_instanceof(result, RegExp)) {
    result = result2;
} else if (!result.global) {}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.validate = function validate() {
        return {};
    };
    return C;
}();
function foo() {
    var v = null;
    if (_instanceof(v, C)) {
        v // Validator & Partial<OnChanges> & C
        ;
    }
    v // Validator & Partial<OnChanges> via subtype reduction
    ;
    // In 4.1, we introduced a change which _fixed_ a bug with CFA
    // correctly setting this to be the right object. With 4.2,
    // we reverted that fix in #42231 which brought behavior back to
    // before 4.1.
    if (v.onChanges) {
        v.onChanges({});
    }
}
