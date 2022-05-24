import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Lion = /*#__PURE__*/ function(Animal) {
    "use strict";
    _inherits(Lion, Animal);
    var _super = _create_super(Lion);
    function Lion() {
        _class_call_check(this, Lion);
        var _this;
        _this = _super.apply(this, arguments);
        _this._sound = "roar";
        return _this;
    }
    _create_class(Lion, [
        {
            key: "sound",
            get: function get() {
                return this._sound;
            },
            set: function set(val) {
                this._sound = val;
            }
        }
    ]);
    return Lion;
}(Animal);
