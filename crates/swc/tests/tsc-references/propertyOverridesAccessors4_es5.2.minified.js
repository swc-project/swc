import * as swcHelpers from "@swc/helpers";
var Lion = function(Animal) {
    "use strict";
    swcHelpers.inherits(Lion, Animal);
    var _super = swcHelpers.createSuper(Lion);
    function Lion() {
        var _this;
        return swcHelpers.classCallCheck(this, Lion), _this = _super.apply(this, arguments), _this.sound = 'RAWR!', _this;
    }
    return Lion;
}(Animal);
