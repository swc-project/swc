import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function namedClasses(x) {
    if ("a" in x) {
        x.a = "1";
    } else {
        x.b = 1;
    }
}
function multipleClasses(x) {
    if ("a" in x) {
        var y = x.a;
    } else {
        var z = x.b;
    }
}
function anonymousClasses(x) {
    if ("a" in x) {
        var y = x.a;
    } else {
        var z = x.b;
    }
}
var AWithOptionalProp = function AWithOptionalProp() {
    "use strict";
    _class_call_check(this, AWithOptionalProp);
};
var BWithOptionalProp = function BWithOptionalProp() {
    "use strict";
    _class_call_check(this, BWithOptionalProp);
};
function positiveTestClassesWithOptionalProperties(x) {
    if ("a" in x) {
        x.a = "1";
    } else {
        var y = _instanceof(x, AWithOptionalProp) ? x.a : x.b;
    }
}
function inParenthesizedExpression(x) {
    if ("a" in x) {
        var y = x.a;
    } else {
        var z = x.b;
    }
}
var ClassWithUnionProp = function ClassWithUnionProp() {
    "use strict";
    _class_call_check(this, ClassWithUnionProp);
};
function inProperty(x) {
    if ("a" in x.prop) {
        var y = x.prop.a;
    } else {
        var z = x.prop.b;
    }
}
var NestedClassWithProp = function NestedClassWithProp() {
    "use strict";
    _class_call_check(this, NestedClassWithProp);
};
function innestedProperty(x) {
    if ("a" in x.outer.prop) {
        var y = x.outer.prop.a;
    } else {
        var z = x.outer.prop.b;
    }
}
var InMemberOfClass = /*#__PURE__*/ function() {
    "use strict";
    function InMemberOfClass() {
        _class_call_check(this, InMemberOfClass);
    }
    var _proto = InMemberOfClass.prototype;
    _proto.inThis = function inThis() {
        if ("a" in this.prop) {
            var y = this.prop.a;
        } else {
            var z = this.prop.b;
        }
    };
    return InMemberOfClass;
}();
// added for completeness
var SelfAssert = /*#__PURE__*/ function() {
    "use strict";
    function SelfAssert() {
        _class_call_check(this, SelfAssert);
    }
    var _proto = SelfAssert.prototype;
    _proto.inThis = function inThis() {
        if ("a" in this) {
            var y = this.a;
        } else {}
    };
    return SelfAssert;
}();
function f(i) {
    if ("a" in i) {
        return i.a;
    } else if ("b" in i) {
        return i.b;
    }
    return "c" in i && i.c;
}
