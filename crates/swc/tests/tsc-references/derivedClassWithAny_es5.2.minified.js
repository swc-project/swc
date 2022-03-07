import * as swcHelpers from "@swc/helpers";
var e, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function() {
        return 1;
    }, C.bar = function() {
        return 1;
    }, swcHelpers.createClass(C, [
        {
            key: "X",
            get: function() {
                return 1;
            }
        }
    ], [
        {
            key: "Y",
            get: function() {
                return 1;
            }
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D.prototype.foo = function() {
        return 1;
    }, D.bar = function() {
        return null;
    }, swcHelpers.createClass(D, [
        {
            key: "X",
            get: function() {
                return null;
            }
        }
    ], [
        {
            key: "Y",
            get: function() {
                return null;
            }
        }
    ]), D;
}(C), E = function(D) {
    "use strict";
    swcHelpers.inherits(E, D);
    var _super = swcHelpers.createSuper(E);
    function E() {
        return swcHelpers.classCallCheck(this, E), _super.apply(this, arguments);
    }
    return E.prototype.foo = function() {
        return "";
    }, E.bar = function() {
        return "";
    }, swcHelpers.createClass(E, [
        {
            key: "X",
            get: function() {
                return "";
            }
        }
    ], [
        {
            key: "Y",
            get: function() {
                return "";
            }
        }
    ]), E;
}(D);
e.foo();
