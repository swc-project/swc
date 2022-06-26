import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @noEmit: true
// @checkJs: true
// @allowJs: true
// @Filename: bug24703.js
var Common = {};
Common.I = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.i = 1;
};
Common.O = /*#__PURE__*/ function(_I) {
    "use strict";
    _inherits(_class, _I);
    var _super = _create_super(_class);
    function _class() {
        _class_call_check(this, _class);
        var _this;
        _this = _super.call(this);
        _this.o = 2;
        return _this;
    }
    return _class;
}(Common.I);
var o = new Common.O();
var i = new Common.I();
o.i;
o.o;
i.i;
