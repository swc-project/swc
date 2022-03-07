import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    return _proto.method = function() {}, _proto.other = function() {
        var _obj, ref;
        null === (ref = (_obj = this).method) || void 0 === ref || ref.call(_obj);
    }, C;
}();
