import * as swcHelpers from "@swc/helpers";
var Lion = function(Animal) {
    swcHelpers.inherits(Lion, Animal);
    var _super = swcHelpers.createSuper(Lion);
    function Lion() {
        var _this;
        return swcHelpers.classCallCheck(this, Lion), _this = _super.apply(this, arguments), _this._sound = "roar", _this;
    }
    return swcHelpers.createClass(Lion, [
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
