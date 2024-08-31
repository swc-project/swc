//// [classWithBaseClassButNoConstructor.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base(x) {
    "use strict";
    _class_call_check(this, Base);
};
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(C, Base);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(Base);
var r = C;
var c = new C(); // error
var c2 = new C(1); // ok
var Base2 = function Base2(x) {
    "use strict";
    _class_call_check(this, Base2);
};
var D = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(D, Base2);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(Base2);
var r2 = D;
var d = new D(); // error
var d2 = new D(1); // ok
// specialized base class
var D2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(D2, Base2);
    function D2() {
        _class_call_check(this, D2);
        return _call_super(this, D2, arguments);
    }
    return D2;
}(Base2);
var r3 = D2;
var d3 = new D(); // error
var d4 = new D(1); // ok
var D3 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(D3, Base2);
    function D3() {
        _class_call_check(this, D3);
        return _call_super(this, D3, arguments);
    }
    return D3;
}(Base2);
var r4 = D3;
var d5 = new D(); // error
var d6 = new D(1); // ok
