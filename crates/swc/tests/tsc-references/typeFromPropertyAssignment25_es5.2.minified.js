import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Common = {};
Common.I = function _class() {
    "use strict";
    _class_call_check(this, _class), this.i = 1;
}, Common.O = function(_I) {
    "use strict";
    _inherits(_class, _I);
    var _super = _create_super(_class);
    function _class() {
        var _this;
        return _class_call_check(this, _class), (_this = _super.call(this)).o = 2, _this;
    }
    return _class;
}(Common.I);
var o = new Common.O(), i = new Common.I();
o.i, o.o, i.i;
