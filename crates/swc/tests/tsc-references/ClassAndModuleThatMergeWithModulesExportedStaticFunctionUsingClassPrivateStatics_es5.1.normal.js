import * as swcHelpers from "@swc/helpers";
var clodule = /*#__PURE__*/ function() {
    "use strict";
    function clodule() {
        swcHelpers.classCallCheck(this, clodule);
    }
    swcHelpers.createClass(clodule, null, [
        {
            key: "sfn",
            value: function sfn(id) {
                return 42;
            }
        }
    ]);
    return clodule;
}();
(function(clodule1) {
    var fn = function fn(x, y) {
        return clodule.sfn('a');
    };
    clodule1.fn = fn;
})(clodule || (clodule = {}));
