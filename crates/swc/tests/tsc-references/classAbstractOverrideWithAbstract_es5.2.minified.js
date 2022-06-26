import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {}, A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B;
}(A), AA = function() {
    "use strict";
    function AA() {
        _class_call_check(this, AA);
    }
    return AA.prototype.foo = function() {}, AA;
}(), BB = function(AA) {
    "use strict";
    _inherits(BB, AA);
    var _super = _create_super(BB);
    function BB() {
        return _class_call_check(this, BB), _super.apply(this, arguments);
    }
    return BB.prototype.bar = function() {}, BB;
}(AA), CC = function(BB) {
    "use strict";
    _inherits(CC, BB);
    var _super = _create_super(CC);
    function CC() {
        return _class_call_check(this, CC), _super.apply(this, arguments);
    }
    return CC;
}(BB), DD = function(BB) {
    "use strict";
    _inherits(DD, BB);
    var _super = _create_super(DD);
    function DD() {
        return _class_call_check(this, DD), _super.apply(this, arguments);
    }
    return DD.prototype.foo = function() {}, DD;
}(BB);
