import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function() {
        return '';
    }, C.foo = function() {}, swcHelpers.createClass(C, [
        {
            key: "X",
            get: function() {
                return '';
            },
            set: function(v) {}
        }
    ], [
        {
            key: "X",
            get: function() {
                return 1;
            }
        }
    ]), C;
}();
