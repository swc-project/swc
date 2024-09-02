//// [staticFactory1.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.foo = function foo() {
        return 1;
    };
    Base.create = function create() {
        return new this();
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
    _proto.foo = function foo() {
        return 2;
    };
    return Derived;
}(Base);
var d = Derived.create();
d.foo();
