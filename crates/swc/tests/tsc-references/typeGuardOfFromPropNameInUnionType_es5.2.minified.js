import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
}, B = function() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
}, C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
}, D = function() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
}, AWithOptionalProp = function() {
    "use strict";
    swcHelpers.classCallCheck(this, AWithOptionalProp);
}, BWithOptionalProp = function() {
    "use strict";
    swcHelpers.classCallCheck(this, BWithOptionalProp);
}, ClassWithUnionProp = function() {
    "use strict";
    swcHelpers.classCallCheck(this, ClassWithUnionProp);
}, NestedClassWithProp = function() {
    "use strict";
    swcHelpers.classCallCheck(this, NestedClassWithProp);
}, InMemberOfClass = function() {
    "use strict";
    function InMemberOfClass() {
        swcHelpers.classCallCheck(this, InMemberOfClass);
    }
    return swcHelpers.createClass(InMemberOfClass, [
        {
            key: "inThis",
            value: function() {
                "a" in this.prop ? this.prop.a : this.prop.b;
            }
        }
    ]), InMemberOfClass;
}(), SelfAssert = function() {
    "use strict";
    function SelfAssert() {
        swcHelpers.classCallCheck(this, SelfAssert);
    }
    return swcHelpers.createClass(SelfAssert, [
        {
            key: "inThis",
            value: function() {
                "a" in this && this.a;
            }
        }
    ]), SelfAssert;
}();
