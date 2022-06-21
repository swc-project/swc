import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
