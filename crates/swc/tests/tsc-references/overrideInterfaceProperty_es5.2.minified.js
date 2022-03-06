import * as swcHelpers from "@swc/helpers";
var Sizz = function(Mup) {
    "use strict";
    swcHelpers.inherits(Sizz, Mup);
    var _super = swcHelpers.createSuper(Sizz);
    function Sizz() {
        return swcHelpers.classCallCheck(this, Sizz), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Sizz, [
        {
            key: "size",
            get: function() {
                return 0;
            }
        }
    ]), Sizz;
}(Mup), Kasizz = function(Mup) {
    "use strict";
    swcHelpers.inherits(Kasizz, Mup);
    var _super = swcHelpers.createSuper(Kasizz);
    function Kasizz() {
        var _this;
        return swcHelpers.classCallCheck(this, Kasizz), _this = _super.apply(this, arguments), _this.size = -1, _this;
    }
    return Kasizz;
}(Mup);
