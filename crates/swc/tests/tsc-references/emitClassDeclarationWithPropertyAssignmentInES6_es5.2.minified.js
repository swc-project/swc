import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var C = function() {
    "use strict";
    _class_call_check(this, C), this.x = "Hello world";
}, D = function() {
    "use strict";
    _class_call_check(this, D), this.x = "Hello world", this.y = 10;
}, E = function(D1) {
    "use strict";
    _inherits(E, D1);
    var _super = _create_super(E);
    function E() {
        var _this;
        return _class_call_check(this, E), _this = _super.apply(this, arguments), _this.z = !0, _this;
    }
    return E;
}(D), F = function(D2) {
    "use strict";
    _inherits(F, D2);
    var _super = _create_super(F);
    function F() {
        var _this;
        return _class_call_check(this, F), (_this = _super.call(this)).z = !0, _this.j = "HI", _this;
    }
    return F;
}(D);
