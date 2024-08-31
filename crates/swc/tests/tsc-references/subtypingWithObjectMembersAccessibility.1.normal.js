//// [subtypingWithObjectMembersAccessibility.ts]
// Derived member is private, base member is not causes errors
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _call_super(this, Derived, arguments);
    }
    return Derived;
}(Base);
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    return B;
}(A);
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
var B2 = /*#__PURE__*/ function(A2) {
    "use strict";
    _inherits(B2, A2);
    function B2() {
        _class_call_check(this, B2);
        return _call_super(this, B2, arguments);
    }
    return B2;
}(A2);
var A3 = function A3() {
    "use strict";
    _class_call_check(this, A3);
};
var B3 = /*#__PURE__*/ function(A3) {
    "use strict";
    _inherits(B3, A3);
    function B3() {
        _class_call_check(this, B3);
        return _call_super(this, B3, arguments);
    }
    return B3;
}(A3);
