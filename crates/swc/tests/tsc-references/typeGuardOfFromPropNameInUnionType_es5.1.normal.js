function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
};
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
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
    _classCallCheck(this, AWithOptionalProp);
};
var BWithOptionalProp = function BWithOptionalProp() {
    "use strict";
    _classCallCheck(this, BWithOptionalProp);
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
    _classCallCheck(this, ClassWithUnionProp);
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
    _classCallCheck(this, NestedClassWithProp);
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
        _classCallCheck(this, InMemberOfClass);
    }
    _createClass(InMemberOfClass, [
        {
            key: "inThis",
            value: function inThis() {
                if ("a" in this.prop) {
                    var y = this.prop.a;
                } else {
                    var z = this.prop.b;
                }
            }
        }
    ]);
    return InMemberOfClass;
}();
var SelfAssert = // added for completeness
/*#__PURE__*/ function() {
    "use strict";
    function SelfAssert() {
        _classCallCheck(this, SelfAssert);
    }
    _createClass(SelfAssert, [
        {
            key: "inThis",
            value: function inThis() {
                if ("a" in this) {
                    var y = this.a;
                } else {
                }
            }
        }
    ]);
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
