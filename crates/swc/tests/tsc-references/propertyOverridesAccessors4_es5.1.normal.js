import * as swcHelpers from "@swc/helpers";
var Lion = /*#__PURE__*/ function(Animal) {
    "use strict";
    swcHelpers.inherits(Lion, Animal);
    var _super = swcHelpers.createSuper(Lion);
    function Lion() {
        swcHelpers.classCallCheck(this, Lion);
        var _this;
        _this = _super.apply(this, arguments);
        _this.sound = 'RAWR!' // error here
        ;
        return _this;
    }
    return Lion;
}(Animal);
