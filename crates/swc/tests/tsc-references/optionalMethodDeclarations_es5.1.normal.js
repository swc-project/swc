import * as swcHelpers from "@swc/helpers";
var C = // @target: esnext,es2016
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/34952#issuecomment-552025027
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    // ? should be removed in emit
    _proto.method = function method() {};
    return C;
}();
