import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "X",
            get: function() {
                return "";
            },
            set: function(v) {}
        },
        {
            key: "foo",
            value: function() {
                return "";
            }
        }
    ], [
        {
            key: "foo",
            value: function() {}
        },
        {
            key: "X",
            get: function() {
                return 1;
            }
        }
    ]), C;
}();
