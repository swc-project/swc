import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.foo = function() {}, A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B;
}(A), AA = function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA);
    }
    return AA.prototype.foo = function() {}, AA;
}(), BB = function(AA) {
    "use strict";
    swcHelpers.inherits(BB, AA);
    var _super = swcHelpers.createSuper(BB);
    function BB() {
        return swcHelpers.classCallCheck(this, BB), _super.apply(this, arguments);
    }
    return BB.prototype.bar = function() {}, BB;
}(AA), CC = function(BB) {
    "use strict";
    swcHelpers.inherits(CC, BB);
    var _super = swcHelpers.createSuper(CC);
    function CC() {
        return swcHelpers.classCallCheck(this, CC), _super.apply(this, arguments);
    }
    return CC;
}(BB), DD = function(BB) {
    "use strict";
    swcHelpers.inherits(DD, BB);
    var _super = swcHelpers.createSuper(DD);
    function DD() {
        return swcHelpers.classCallCheck(this, DD), _super.apply(this, arguments);
    }
    return DD.prototype.foo = function() {}, DD;
}(BB);
