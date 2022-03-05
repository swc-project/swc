import * as swcHelpers from "@swc/helpers";
var BaseClass = function BaseClass() {
    "use strict";
    swcHelpers.classCallCheck(this, BaseClass);
};
var Broken = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    swcHelpers.inherits(Broken, BaseClass);
    var _super = swcHelpers.createSuper(Broken);
    function Broken() {
        swcHelpers.classCallCheck(this, Broken);
        return _super.apply(this, arguments);
    }
    return Broken;
}(BaseClass);
new Broken().bar;
var IncorrectlyExtends = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    swcHelpers.inherits(IncorrectlyExtends, BaseClass);
    var _super = swcHelpers.createSuper(IncorrectlyExtends);
    function IncorrectlyExtends() {
        swcHelpers.classCallCheck(this, IncorrectlyExtends);
        return _super.apply(this, arguments);
    }
    return IncorrectlyExtends;
}(BaseClass);
