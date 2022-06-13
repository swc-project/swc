import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @target: esnext
// @useDefineForClassFields: true
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    _create_class(Base, [
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
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 1;
        return _this;
    }
    return Derived;
}(Base);
var obj = new Derived(); // prints 'x was set to 1'
console.log(obj.x); // 2
