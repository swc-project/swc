import * as swcHelpers from "@swc/helpers";
function error(message) {
    throw new Error(message);
}
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "void1",
            value: function() {
                throw new Error();
            }
        },
        {
            key: "void2",
            value: function() {
                for(;;);
            }
        },
        {
            key: "never1",
            value: function() {
                throw new Error();
            }
        },
        {
            key: "never2",
            value: function() {
                for(;;);
            }
        }
    ]), C;
}();
function test(cb) {
    return cb();
}
test(function() {
    return "hello";
}), test(function() {
    return error("Something failed");
}), test(function() {
    throw new Error();
}), test(function() {
    return error("Error callback");
});
