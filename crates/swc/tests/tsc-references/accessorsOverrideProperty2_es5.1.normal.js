import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
    this.x = 1;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Derived, [
        {
            key: "x",
            get: function get() {
                return 2;
            } // should be an error
            ,
            set: function set(value) {
                console.log("x was set to ".concat(value));
            }
        }
    ]);
    return Derived;
}(Base);
var obj = new Derived(); // nothing printed
console.log(obj.x); // 1
