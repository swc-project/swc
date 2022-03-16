import * as swcHelpers from "@swc/helpers";
// @Filename: classExtendsItselfIndirectly_file1.ts
var C = /*#__PURE__*/ function(E1) {
    "use strict";
    swcHelpers.inherits(C, E1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
} // error
(E);
// @Filename: classExtendsItselfIndirectly_file2.ts
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
// @Filename: classExtendsItselfIndirectly_file3.ts
var E = /*#__PURE__*/ function(D) {
    "use strict";
    swcHelpers.inherits(E, D);
    var _super = swcHelpers.createSuper(E);
    function E() {
        swcHelpers.classCallCheck(this, E);
        return _super.apply(this, arguments);
    }
    return E;
}(D);
// @Filename: classExtendsItselfIndirectly_file4.ts
var C2 = /*#__PURE__*/ function(E21) {
    "use strict";
    swcHelpers.inherits(C2, E21);
    var _super = swcHelpers.createSuper(C2);
    function C2() {
        swcHelpers.classCallCheck(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
} // error
(E2);
// @Filename: classExtendsItselfIndirectly_file5.ts
var D2 = /*#__PURE__*/ function(C2) {
    "use strict";
    swcHelpers.inherits(D2, C2);
    var _super = swcHelpers.createSuper(D2);
    function D2() {
        swcHelpers.classCallCheck(this, D2);
        return _super.apply(this, arguments);
    }
    return D2;
}(C2);
// @Filename: classExtendsItselfIndirectly_file6.ts
var E2 = /*#__PURE__*/ function(D2) {
    "use strict";
    swcHelpers.inherits(E2, D2);
    var _super = swcHelpers.createSuper(E2);
    function E2() {
        swcHelpers.classCallCheck(this, E2);
        return _super.apply(this, arguments);
    }
    return E2;
}(D2);
