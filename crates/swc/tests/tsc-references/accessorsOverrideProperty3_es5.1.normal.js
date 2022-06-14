import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Lion = /*#__PURE__*/ function(Animal) {
    "use strict";
    _inherits(Lion, Animal);
    var _super = _create_super(Lion);
    function Lion() {
        _class_call_check(this, Lion);
        var _this;
        _this = _super.apply(this, arguments);
        _this._sound = "grrr";
        return _this;
    }
    _create_class(Lion, [
        {
            key: "sound",
            get: function get() {
                return this._sound;
            } // error here
            ,
            set: function set(val) {
                this._sound = val;
            }
        }
    ]);
    return Lion;
}(Animal);
