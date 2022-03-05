import * as swcHelpers from "@swc/helpers";
var Sizz = /*#__PURE__*/ function(Mup) {
    "use strict";
    swcHelpers.inherits(Sizz, Mup);
    var _super = swcHelpers.createSuper(Sizz);
    function Sizz() {
        swcHelpers.classCallCheck(this, Sizz);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Sizz, [
        {
            key: "size",
            get: // ok, because Mup is an interface
            function get() {
                return 0;
            }
        }
    ]);
    return Sizz;
}(Mup);
var Kasizz = /*#__PURE__*/ function(Mup) {
    "use strict";
    swcHelpers.inherits(Kasizz, Mup);
    var _super = swcHelpers.createSuper(Kasizz);
    function Kasizz() {
        swcHelpers.classCallCheck(this, Kasizz);
        var _this;
        _this = _super.apply(this, arguments);
        _this.size = -1;
        return _this;
    }
    return Kasizz;
}(Mup);
