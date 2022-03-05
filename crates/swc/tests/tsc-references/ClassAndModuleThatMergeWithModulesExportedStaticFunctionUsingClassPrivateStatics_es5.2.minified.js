import * as swcHelpers from "@swc/helpers";
var clodule = function() {
    "use strict";
    function clodule() {
        swcHelpers.classCallCheck(this, clodule);
    }
    return swcHelpers.createClass(clodule, null, [
        {
            key: "sfn",
            value: function(id) {
                return 42;
            }
        }
    ]), clodule;
}();
!function(clodule1) {
    var fn = function(x, y) {
        return clodule.sfn("a");
    };
    clodule1.fn = fn;
}(clodule || (clodule = {}));
