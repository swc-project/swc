import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @allowJs: true
// @checkJs: true
// @target: esnext
// @outDir: out
// @Filename: foo.js
/**
 * @constructor
 */ var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
/**
 * @extends {A}
 * @constructor
 */ var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.call(this);
    }
    return B;
}(A);
