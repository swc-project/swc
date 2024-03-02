//// [bug24703.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Common = {};
Common.I = function _class() {
    _class_call_check(this, _class), this.i = 1;
}, Common.O = function(_Common_I) {
    _inherits(_class, _Common_I);
    var _super = _create_super(_class);
    function _class() {
        var _this;
        return _class_call_check(this, _class), (_this = _super.call(this)).o = 2, _this;
    }
    return _class;
}(Common.I);
var o = new Common.O(), i = new Common.I();
o.i, o.o, i.i;
