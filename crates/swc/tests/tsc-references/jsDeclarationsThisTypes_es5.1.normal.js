import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @outDir: /out
// @lib: es6
// @declaration: true
// @filename: index.js
export var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    /** @returns {this} */ _proto.method = function method() {
        return this;
    };
    return A;
}();
var Base = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(Base, A);
    var _super = swcHelpers.createSuper(Base);
    function Base() {
        swcHelpers.classCallCheck(this, Base);
        return _super.apply(this, arguments);
    }
    var _proto = Base.prototype;
    // This method is required to reproduce #35932
    _proto.verify = function verify() {};
    return Base;
}(A);
export { Base as default };
