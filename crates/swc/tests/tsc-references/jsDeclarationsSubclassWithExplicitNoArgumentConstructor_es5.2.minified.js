import * as swcHelpers from "@swc/helpers";
export var Super = function(firstArg, secondArg) {
    swcHelpers.classCallCheck(this, Super);
};
export var Sub = function(Super1) {
    swcHelpers.inherits(Sub, Super1);
    var _super = swcHelpers.createSuper(Sub);
    function Sub() {
        return swcHelpers.classCallCheck(this, Sub), _super.call(this, "first", "second");
    }
    return Sub;
}(Super);
