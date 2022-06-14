import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
    Derived.make // ok
     = function make() {
        new Base();
    };
    return Derived;
}(Base);
var Unrelated = /*#__PURE__*/ function() {
    "use strict";
    function Unrelated() {
        _class_call_check(this, Unrelated);
    }
    Unrelated.fake // error
     = function fake() {
        new Base();
    };
    return Unrelated;
}();
