import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base), this.x = 1;
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Derived, [
        {
            key: "x",
            get: function() {
                return 2;
            },
            set: function(value) {
                console.log("x was set to ".concat(value));
            }
        }
    ]), Derived;
}(Base), obj = new Derived();
console.log(obj.x);
