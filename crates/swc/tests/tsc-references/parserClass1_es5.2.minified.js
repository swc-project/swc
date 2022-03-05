import * as swcHelpers from "@swc/helpers";
export var NullLogger = function() {
    "use strict";
    function NullLogger() {
        swcHelpers.classCallCheck(this, NullLogger);
    }
    return swcHelpers.createClass(NullLogger, [
        {
            key: "information",
            value: function() {
                return !1;
            }
        },
        {
            key: "debug",
            value: function() {
                return !1;
            }
        },
        {
            key: "warning",
            value: function() {
                return !1;
            }
        },
        {
            key: "error",
            value: function() {
                return !1;
            }
        },
        {
            key: "fatal",
            value: function() {
                return !1;
            }
        },
        {
            key: "log",
            value: function(s) {}
        }
    ]), NullLogger;
}();
