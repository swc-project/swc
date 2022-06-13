import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @lib: esnext
// @Filename: bug25101.js
/**
 * @template T
 * @extends {Set<T>} Should prefer this Set<T>, not the Set in the heritage clause
 */ var My = /*#__PURE__*/ function(Set) {
    "use strict";
    _inherits(My, Set);
    var _super = _create_super(My);
    function My() {
        _class_call_check(this, My);
        return _super.apply(this, arguments);
    }
    return My;
}(_wrap_native_super(Set));
