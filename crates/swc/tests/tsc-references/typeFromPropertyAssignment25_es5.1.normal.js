import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @checkJs: true
// @allowJs: true
// @Filename: bug24703.js
var Common = {};
Common.I = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    this.i = 1;
};
Common.O = /*#__PURE__*/ (function(_I) {
    "use strict";
    swcHelpers.inherits(_class, _I);
    var _super = swcHelpers.createSuper(_class);
    function _class() {
        swcHelpers.classCallCheck(this, _class);
        var _this;
        _this = _super.call(this);
        _this.o = 2;
        return _this;
    }
    return _class;
})(Common.I);
var o = new Common.O();
var i = new Common.I();
o.i;
o.o;
i.i;
