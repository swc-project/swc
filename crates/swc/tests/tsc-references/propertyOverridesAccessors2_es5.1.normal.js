import * as swcHelpers from "@swc/helpers";
// @target: esnext
// @useDefineForClassFields: true
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "x",
            get: function get() {
                return 2;
            },
            set: function set(value) {
                console.log("x was set to ".concat(value));
            }
        }
    ]);
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 1;
        return _this;
    }
    return Derived;
}(Base);
var obj = new Derived(); // prints 'x was set to 1'
console.log(obj.x); // 2
