import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {}
        }
    ]), C;
}(), D = function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return swcHelpers.createClass(D, [
        {
            key: "foo2",
            value: function() {}
        }
    ]), D;
}(), E = function(C) {
    "use strict";
    swcHelpers.inherits(E, C);
    var _super = swcHelpers.createSuper(E);
    function E() {
        return swcHelpers.classCallCheck(this, E), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(E, [
        {
            key: "foo3",
            value: function() {}
        }
    ]), E;
}(C), F = function(C) {
    "use strict";
    swcHelpers.inherits(F, C);
    var _super = swcHelpers.createSuper(F);
    function F() {
        return swcHelpers.classCallCheck(this, F), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(F, [
        {
            key: "foo4",
            value: function() {}
        }
    ]), F;
}(C);
