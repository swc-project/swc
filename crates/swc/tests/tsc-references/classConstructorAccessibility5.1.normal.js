//// [classConstructorAccessibility5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    Derived.make = function make() {
        new Base();
    } // ok
    ;
    return Derived;
}(Base);
var Unrelated = /*#__PURE__*/ function() {
    "use strict";
    function Unrelated() {
        _class_call_check(this, Unrelated);
    }
    Unrelated.fake = function fake() {
        new Base();
    } // error
    ;
    return Unrelated;
}();
