import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Sizz = /*#__PURE__*/ function(Mup) {
    "use strict";
    _inherits(Sizz, Mup);
    var _super = _create_super(Sizz);
    function Sizz() {
        _class_call_check(this, Sizz);
        return _super.apply(this, arguments);
    }
    _create_class(Sizz, [
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
    _inherits(Kasizz, Mup);
    var _super = _create_super(Kasizz);
    function Kasizz() {
        _class_call_check(this, Kasizz);
        var _this;
        _this = _super.apply(this, arguments);
        _this.size = -1;
        return _this;
    }
    return Kasizz;
}(Mup);
