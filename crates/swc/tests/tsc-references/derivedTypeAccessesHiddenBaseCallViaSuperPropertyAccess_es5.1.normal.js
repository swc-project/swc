import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.foo = function foo(x) {
        return null;
    };
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    _proto.foo = function foo(x) {
        return null;
    };
    _proto.bar = function bar() {
        var r = _get(_get_prototype_of(Derived.prototype), "foo", this).call(this, {
            a: 1
        }); // { a: number }
        var r2 = _get(_get_prototype_of(Derived.prototype), "foo", this).call(this, {
            a: 1,
            b: 2
        }); // { a: number }
        var r3 = this.foo({
            a: 1,
            b: 2
        }); // { a: number; b: number; }
    };
    return Derived;
}(Base);
