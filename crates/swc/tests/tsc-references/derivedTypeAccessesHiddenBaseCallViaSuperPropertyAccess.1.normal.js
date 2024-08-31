//// [derivedTypeAccessesHiddenBaseCallViaSuperPropertyAccess.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
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
