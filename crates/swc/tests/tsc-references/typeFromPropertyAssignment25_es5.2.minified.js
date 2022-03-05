import * as swcHelpers from "@swc/helpers";
var Common = {};
Common.I = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class), this.i = 1;
}, Common.O = (function(_I) {
    "use strict";
    swcHelpers.inherits(_class, _I);
    var _super = swcHelpers.createSuper(_class);
    function _class() {
        var _this;
        return swcHelpers.classCallCheck(this, _class), (_this = _super.call(this)).o = 2, _this;
    }
    return _class;
})(Common.I);
var o = new Common.O(), i = new Common.I();
o.i, o.o, i.i;
