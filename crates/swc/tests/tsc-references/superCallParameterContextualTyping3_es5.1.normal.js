import * as swcHelpers from "@swc/helpers";
var CBase = /*#__PURE__*/ function() {
    "use strict";
    function CBase(param) {
        swcHelpers.classCallCheck(this, CBase);
    }
    var _proto = CBase.prototype;
    _proto.foo = function foo(param) {};
    return CBase;
}();
var C = /*#__PURE__*/ function(CBase) {
    "use strict";
    swcHelpers.inherits(C, CBase);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        var _this = _super.call(this, {
            method: function method(p) {
                p.length;
            }
        });
        // Should be okay.
        // 'p' should have type 'string'.
        swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(C.prototype)), "foo", _this).call(_this, {
            method: function method(p) {
                p.length;
            }
        });
        return _this;
    }
    return C;
}(CBase);
