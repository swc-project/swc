import * as swcHelpers from "@swc/helpers";
var clodule = /*#__PURE__*/ function() {
    "use strict";
    function clodule() {
        swcHelpers.classCallCheck(this, clodule);
    }
    clodule.sfn = function sfn(id) {
        return 42;
    };
    return clodule;
}();
(function(clodule1) {
    var fn = function fn(x, y) {
        return clodule.sfn('a');
    };
    clodule1.fn = fn;
})(clodule || (clodule = {}));
