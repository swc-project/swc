import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @Filename: classExtendsItselfIndirectly_file1.ts
var C = /*#__PURE__*/ function(E1) {
    "use strict";
    _inherits(C, E1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
} // error
(E);
// @Filename: classExtendsItselfIndirectly_file2.ts
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
// @Filename: classExtendsItselfIndirectly_file3.ts
var E = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(E, D);
    var _super = _create_super(E);
    function E() {
        _class_call_check(this, E);
        return _super.apply(this, arguments);
    }
    return E;
}(D);
// @Filename: classExtendsItselfIndirectly_file4.ts
var C2 = /*#__PURE__*/ function(E21) {
    "use strict";
    _inherits(C2, E21);
    var _super = _create_super(C2);
    function C2() {
        _class_call_check(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
} // error
(E2);
// @Filename: classExtendsItselfIndirectly_file5.ts
var D2 = /*#__PURE__*/ function(C2) {
    "use strict";
    _inherits(D2, C2);
    var _super = _create_super(D2);
    function D2() {
        _class_call_check(this, D2);
        return _super.apply(this, arguments);
    }
    return D2;
}(C2);
// @Filename: classExtendsItselfIndirectly_file6.ts
var E2 = /*#__PURE__*/ function(D2) {
    "use strict";
    _inherits(E2, D2);
    var _super = _create_super(E2);
    function E2() {
        _class_call_check(this, E2);
        return _super.apply(this, arguments);
    }
    return E2;
}(D2);
