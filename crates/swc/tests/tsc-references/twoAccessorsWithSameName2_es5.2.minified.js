import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, null, [
        {
            key: "x",
            get: function() {
                return 1;
            }
        }
    ]), C;
}(), D = function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return swcHelpers.createClass(D, null, [
        {
            key: "x",
            set: function(v) {}
        }
    ]), D;
}(), E = function() {
    "use strict";
    function E() {
        swcHelpers.classCallCheck(this, E);
    }
    return swcHelpers.createClass(E, null, [
        {
            key: "x",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), E;
}();
