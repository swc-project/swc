//// [derivedClassWithoutExplicitConstructor2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base(x) {
    "use strict";
    _class_call_check(this, Base);
    this.a = 1;
    this.a = x;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _call_super(this, Derived, arguments), _this.x = 1, _this.y = 'hello';
        return _this;
    }
    return Derived;
}(Base);
var r = new Derived(); // error
var r2 = new Derived(1);
var r3 = new Derived(1, 2);
var r4 = new Derived(1, 2, 3);
var Base2 = function Base2(x) {
    "use strict";
    _class_call_check(this, Base2);
    this.a = x;
};
var D = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(D, Base2);
    function D() {
        _class_call_check(this, D);
        var _this;
        _this = _call_super(this, D, arguments), _this.x = 2, _this.y = null;
        return _this;
    }
    return D;
}(Base2);
var d = new D(); // error
var d2 = new D(new Date()); // ok
var d3 = new D(new Date(), new Date());
var d4 = new D(new Date(), new Date(), new Date());
