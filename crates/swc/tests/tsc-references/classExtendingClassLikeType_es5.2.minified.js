import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var D0 = function(Base) {
    "use strict";
    _inherits(D0, Base);
    var _super = _create_super(D0);
    function D0() {
        return _class_call_check(this, D0), _super.apply(this, arguments);
    }
    return D0;
}(Base), D1 = function(_superClass) {
    "use strict";
    _inherits(D1, _superClass);
    var _super = _create_super(D1);
    function D1() {
        var _this;
        return _class_call_check(this, D1), (_this = _super.call(this, "abc", "def")).x = "x", _this.y = "y", _this;
    }
    return D1;
}(getBase()), D2 = function(_superClass) {
    "use strict";
    _inherits(D2, _superClass);
    var _super = _create_super(D2);
    function D2() {
        var _this;
        return _class_call_check(this, D2), _this = _super.call(this, 10), _this = _super.call(this, 10, 20), _this.x = 1, _this.y = 2, _this;
    }
    return D2;
}(getBase()), D3 = function(_superClass) {
    "use strict";
    _inherits(D3, _superClass);
    var _super = _create_super(D3);
    function D3() {
        var _this;
        return _class_call_check(this, D3), (_this = _super.call(this, "abc", 42)).x = "x", _this.y = 2, _this;
    }
    return D3;
}(getBase()), D4 = function(_superClass) {
    "use strict";
    _inherits(D4, _superClass);
    var _super = _create_super(D4);
    function D4() {
        return _class_call_check(this, D4), _super.apply(this, arguments);
    }
    return D4;
}(getBase()), D5 = function(_superClass) {
    "use strict";
    _inherits(D5, _superClass);
    var _super = _create_super(D5);
    function D5() {
        return _class_call_check(this, D5), _super.apply(this, arguments);
    }
    return D5;
}(getBadBase());
