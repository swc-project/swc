import * as swcHelpers from "@swc/helpers";
var result;
var result2;
if (!swcHelpers._instanceof(result, RegExp)) {
    result = result2;
} else if (!result.global) {}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "validate",
            value: function validate() {
                return {};
            }
        }
    ]);
    return C;
}();
function foo() {
    var v = null;
    if (swcHelpers._instanceof(v, C)) {
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
