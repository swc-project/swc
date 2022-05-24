import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Lion = function(Animal) {
    "use strict";
    _inherits(Lion, Animal);
    var _super = _create_super(Lion);
    function Lion() {
        var _this;
        return _class_call_check(this, Lion), _this = _super.apply(this, arguments), _this._sound = "grrr", _this;
    }
    return _create_class(Lion, [
        {
            key: "sound",
            get: function() {
                return this._sound;
            },
            set: function(val) {
                this._sound = val;
            }
        }
    ]), Lion;
}(Animal);
