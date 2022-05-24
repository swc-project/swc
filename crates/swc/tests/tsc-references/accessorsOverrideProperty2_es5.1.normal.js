import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
