//// [derivedClassWithoutExplicitConstructor3.ts]
// automatic constructors with a class hieararchy of depth > 2
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
    function Derived(y, z) {
        _class_call_check(this, Derived);
        var _this;
        _this = _call_super(this, Derived, [
            2
        ]), _this.b = '';
        _this.b = y;
        return _this;
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    function Derived2() {
        _class_call_check(this, Derived2);
        var _this;
        _this = _call_super(this, Derived2, arguments), _this.x = 1, _this.y = 'hello';
        return _this;
    }
    return Derived2;
}(Derived);
var r = new Derived(); // error
var r2 = new Derived2(1); // error
var r3 = new Derived('', '');
var Base2 = function Base2(x) {
    "use strict";
    _class_call_check(this, Base2);
    this.a = x;
};
var D = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(D, Base);
    function D(y, z) {
        _class_call_check(this, D);
        var _this;
        _this = _call_super(this, D, [
            2
        ]), _this.b = null;
        _this.b = y;
        return _this;
    }
    return D;
}(Base);
var D2 = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(D2, D);
    function D2() {
        _class_call_check(this, D2);
        var _this;
        _this = _call_super(this, D2, arguments), _this.x = 2, _this.y = null;
        return _this;
    }
    return D2;
}(D);
var d = new D2(); // error
var d2 = new D2(new Date()); // error
var d3 = new D2(new Date(), new Date()); // ok
