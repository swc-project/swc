import * as swcHelpers from "@swc/helpers";
var Lion = /*#__PURE__*/ function(Animal) {
    "use strict";
    swcHelpers.inherits(Lion, Animal);
    var _super = swcHelpers.createSuper(Lion);
    function Lion() {
        swcHelpers.classCallCheck(this, Lion);
        var _this;
        _this = _super.apply(this, arguments);
        _this._sound = 'grrr';
        return _this;
    }
    swcHelpers.createClass(Lion, [
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
