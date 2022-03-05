import * as swcHelpers from "@swc/helpers";
var BaseClass = function() {
    "use strict";
    swcHelpers.classCallCheck(this, BaseClass);
}, Broken = function(BaseClass1) {
    "use strict";
    swcHelpers.inherits(Broken, BaseClass1);
    var _super = swcHelpers.createSuper(Broken);
    function Broken() {
        return swcHelpers.classCallCheck(this, Broken), _super.apply(this, arguments);
    }
    return Broken;
}(BaseClass);
new Broken().bar;
var IncorrectlyExtends = function(BaseClass2) {
    "use strict";
    swcHelpers.inherits(IncorrectlyExtends, BaseClass2);
    var _super = swcHelpers.createSuper(IncorrectlyExtends);
    function IncorrectlyExtends() {
        return swcHelpers.classCallCheck(this, IncorrectlyExtends), _super.apply(this, arguments);
    }
    return IncorrectlyExtends;
}(BaseClass);
