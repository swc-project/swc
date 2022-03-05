import * as swcHelpers from "@swc/helpers";
var Animal = function() {
    "use strict";
    function Animal() {
        swcHelpers.classCallCheck(this, Animal), this._sound = "rustling noise in the bushes";
    }
    return swcHelpers.createClass(Animal, [
        {
            key: "sound",
            get: function() {
                return this._sound;
            },
            set: function(val) {
                this._sound = val;
            }
        },
        {
            key: "makeSound",
            value: function() {
                console.log(this._sound);
            }
        }
    ]), Animal;
}();
(new Animal).makeSound();
var Lion = function(Animal) {
    "use strict";
    swcHelpers.inherits(Lion, Animal);
    var _super = swcHelpers.createSuper(Lion);
    function Lion() {
        var _this;
        return swcHelpers.classCallCheck(this, Lion), _this = _super.apply(this, arguments), _this.sound = "RAWR!", _this;
    }
    return Lion;
}(Animal);
(new Lion).makeSound();
