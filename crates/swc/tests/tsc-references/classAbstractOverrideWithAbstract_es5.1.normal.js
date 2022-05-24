import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {};
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var AA = /*#__PURE__*/ function() {
    "use strict";
    function AA() {
        _class_call_check(this, AA);
    }
    var _proto = AA.prototype;
    _proto.foo = function foo() {};
    return AA;
}();
var BB = /*#__PURE__*/ function(AA) {
    "use strict";
    _inherits(BB, AA);
    var _super = _create_super(BB);
    function BB() {
        _class_call_check(this, BB);
        return _super.apply(this, arguments);
    }
    var _proto = BB.prototype;
    _proto.bar = function bar() {};
    return BB;
}(AA);
var CC = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(CC, BB);
    var _super = _create_super(CC);
    function CC() {
        _class_call_check(this, CC);
        return _super.apply(this, arguments);
    }
    return CC;
} // error
(BB);
var DD = /*#__PURE__*/ function(BB) {
    "use strict";
    _inherits(DD, BB);
    var _super = _create_super(DD);
    function DD() {
        _class_call_check(this, DD);
        return _super.apply(this, arguments);
    }
    var _proto = DD.prototype;
    _proto.foo = function foo() {};
    return DD;
}(BB);
