import * as swcHelpers from "@swc/helpers";
export var NullLogger = /*#__PURE__*/ function() {
    "use strict";
    function NullLogger() {
        swcHelpers.classCallCheck(this, NullLogger);
    }
    swcHelpers.createClass(NullLogger, [
        {
            key: "information",
            value: function information() {
                return false;
            }
        },
        {
            key: "debug",
            value: function debug() {
                return false;
            }
        },
        {
            key: "warning",
            value: function warning() {
                return false;
            }
        },
        {
            key: "error",
            value: function error() {
                return false;
            }
        },
        {
            key: "fatal",
            value: function fatal() {
                return false;
            }
        },
        {
            key: "log",
            value: function log(s) {}
        }
    ]);
    return NullLogger;
}();
