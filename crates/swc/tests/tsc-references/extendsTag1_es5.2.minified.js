import * as swcHelpers from "@swc/helpers";
var My = function(Set) {
    swcHelpers.inherits(My, Set);
    var _super = swcHelpers.createSuper(My);
    function My() {
        return swcHelpers.classCallCheck(this, My), _super.apply(this, arguments);
    }
    return My;
}(swcHelpers.wrapNativeSuper(Set));
