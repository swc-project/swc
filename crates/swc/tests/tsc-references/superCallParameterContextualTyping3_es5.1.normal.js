import _assert_this_initialized from "@swc/helpers/lib/_assert_this_initialized.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var CBase = /*#__PURE__*/ function() {
    "use strict";
    function CBase(param) {
        _class_call_check(this, CBase);
    }
    var _proto = CBase.prototype;
    _proto.foo = function foo(param) {};
    return CBase;
}();
var C = /*#__PURE__*/ function(CBase) {
    "use strict";
    _inherits(C, CBase);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        var _this = _super.call(this, {
            method: function method(p) {
                p.length;
            }
        });
        // Should be okay.
        // 'p' should have type 'string'.
        _get((_assert_this_initialized(_this), _get_prototype_of(C.prototype)), "foo", _this).call(_this, {
            method: function method(p) {
                p.length;
            }
        });
        return _this;
    }
    return C;
}(CBase);
