import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: bar.js
export var Z = /*#__PURE__*/ function() {
    "use strict";
    function Z() {
        swcHelpers.classCallCheck(this, Z);
    }
    var _proto = Z.prototype;
    _proto.f = function f() {
        var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, y = arguments.length > 1 ? arguments[1] : void 0;
        return [
            x,
            y
        ];
    };
    return Z;
}();
