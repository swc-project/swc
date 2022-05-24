import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function() {
    "use strict";
    _class_call_check(this, Base), this.x = 1;
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return _create_class(Derived, [
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
