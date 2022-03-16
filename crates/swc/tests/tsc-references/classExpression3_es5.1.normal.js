import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(_class, _superClass);
    var _super = swcHelpers.createSuper(_class);
    function _class() {
        swcHelpers.classCallCheck(this, _class);
        var _this;
        _this = _super.apply(this, arguments);
        _this.c = 3;
        return _this;
    }
    return _class;
}(/*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(_class, _superClass);
    var _super = swcHelpers.createSuper(_class);
    function _class() {
        swcHelpers.classCallCheck(this, _class);
        var _this;
        _this = _super.apply(this, arguments);
        _this.b = 2;
        return _this;
    }
    return _class;
}(function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    this.a = 1;
}));
var c = new C();
c.a;
c.b;
c.c;
