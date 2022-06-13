import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @allowJs: true
// @checkJs: true
// @outDir: /out
// @lib: es6
// @declaration: true
// @filename: index.js
export var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    /** @returns {this} */ _proto.method = function method() {
        return this;
    };
    return A;
}();
var Base = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(Base, A);
    var _super = _create_super(Base);
    function Base() {
        _class_call_check(this, Base);
        return _super.apply(this, arguments);
    }
    var _proto = Base.prototype;
    // This method is required to reproduce #35932
    _proto.verify = function verify() {};
    return Base;
}(A);
export { Base as default };
