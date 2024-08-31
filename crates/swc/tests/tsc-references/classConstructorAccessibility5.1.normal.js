//// [classConstructorAccessibility5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
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
