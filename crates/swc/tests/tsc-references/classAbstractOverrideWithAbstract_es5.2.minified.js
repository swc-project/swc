import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "foo",
            value: function() {}
        }
    ]), A;
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
    return swcHelpers.createClass(AA, [
        {
            key: "foo",
            value: function() {}
        }
    ]), AA;
}(), BB = function(AA) {
    "use strict";
    swcHelpers.inherits(BB, AA);
    var _super = swcHelpers.createSuper(BB);
    function BB() {
        return swcHelpers.classCallCheck(this, BB), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(BB, [
        {
            key: "bar",
            value: function() {}
        }
    ]), BB;
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
    return swcHelpers.createClass(DD, [
        {
            key: "foo",
            value: function() {}
        }
    ]), DD;
}(BB);
