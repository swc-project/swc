import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var A = function() {
    "use strict";
    _class_call_check(this, A);
}, B = function() {
    "use strict";
    _class_call_check(this, B);
}, C = function() {
    "use strict";
    _class_call_check(this, C);
}, D = function() {
    "use strict";
    _class_call_check(this, D);
}, AWithOptionalProp = function() {
    "use strict";
    _class_call_check(this, AWithOptionalProp);
}, BWithOptionalProp = function() {
    "use strict";
    _class_call_check(this, BWithOptionalProp);
}, ClassWithUnionProp = function() {
    "use strict";
    _class_call_check(this, ClassWithUnionProp);
}, NestedClassWithProp = function() {
    "use strict";
    _class_call_check(this, NestedClassWithProp);
}, InMemberOfClass = function() {
    "use strict";
    function InMemberOfClass() {
        _class_call_check(this, InMemberOfClass);
    }
    return InMemberOfClass.prototype.inThis = function() {
        "a" in this.prop ? this.prop.a : this.prop.b;
    }, InMemberOfClass;
}(), SelfAssert = function() {
    "use strict";
    function SelfAssert() {
        _class_call_check(this, SelfAssert);
    }
    return SelfAssert.prototype.inThis = function() {
        "a" in this && this.a;
    }, SelfAssert;
}();
