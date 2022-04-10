import * as swcHelpers from "@swc/helpers";
var A = function() {
    swcHelpers.classCallCheck(this, A);
}, B = function() {
    swcHelpers.classCallCheck(this, B);
}, C = function() {
    swcHelpers.classCallCheck(this, C);
}, D = function() {
    swcHelpers.classCallCheck(this, D);
}, AWithOptionalProp = function() {
    swcHelpers.classCallCheck(this, AWithOptionalProp);
}, BWithOptionalProp = function() {
    swcHelpers.classCallCheck(this, BWithOptionalProp);
}, ClassWithUnionProp = function() {
    swcHelpers.classCallCheck(this, ClassWithUnionProp);
}, NestedClassWithProp = function() {
    swcHelpers.classCallCheck(this, NestedClassWithProp);
}, InMemberOfClass = function() {
    function InMemberOfClass() {
        swcHelpers.classCallCheck(this, InMemberOfClass);
    }
    return InMemberOfClass.prototype.inThis = function() {
        "a" in this.prop ? this.prop.a : this.prop.b;
    }, InMemberOfClass;
}(), SelfAssert = function() {
    function SelfAssert() {
        swcHelpers.classCallCheck(this, SelfAssert);
    }
    return SelfAssert.prototype.inThis = function() {
        "a" in this && this.a;
    }, SelfAssert;
}();
