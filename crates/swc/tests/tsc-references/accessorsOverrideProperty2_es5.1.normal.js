import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @target: esnext
// @useDefineForClassFields: true
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
    this.x = 1;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    _create_class(Derived, [
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
