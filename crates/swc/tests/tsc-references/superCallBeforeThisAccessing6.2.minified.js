//// [superCallBeforeThisAccessing6.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Base) {
    "use strict";
    _inherits(D, Base);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.call(this, _assert_this_initialized(_this));
    }
    return D;
}(function Base(c) {
    "use strict";
    _class_call_check(this, Base);
});
