//// [typeGuardOfFromPropNameInUnionType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
}, B = function B() {
    "use strict";
    _class_call_check(this, B);
}, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function namedClasses(x) {
    "a" in x ? x.a = "1" : x.b = 1;
}
function multipleClasses(x) {
    "a" in x ? x.a : x.b;
}
function anonymousClasses(x) {
    "a" in x ? x.a : x.b;
}
var AWithOptionalProp = function AWithOptionalProp() {
    "use strict";
    _class_call_check(this, AWithOptionalProp);
}, BWithOptionalProp = function BWithOptionalProp() {
    "use strict";
    _class_call_check(this, BWithOptionalProp);
};
function positiveTestClassesWithOptionalProperties(x) {
    "a" in x ? x.a = "1" : _instanceof(x, AWithOptionalProp) ? x.a : x.b;
}
function inParenthesizedExpression(x) {
    "a" in x ? x.a : x.b;
}
var ClassWithUnionProp = function ClassWithUnionProp() {
    "use strict";
    _class_call_check(this, ClassWithUnionProp);
};
function inProperty(x) {
    "a" in x.prop ? x.prop.a : x.prop.b;
}
var NestedClassWithProp = function NestedClassWithProp() {
    "use strict";
    _class_call_check(this, NestedClassWithProp);
};
function innestedProperty(x) {
    "a" in x.outer.prop ? x.outer.prop.a : x.outer.prop.b;
}
var InMemberOfClass = function() {
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
function f(i) {
    return "a" in i ? i.a : "b" in i ? i.b : "c" in i && i.c;
}
