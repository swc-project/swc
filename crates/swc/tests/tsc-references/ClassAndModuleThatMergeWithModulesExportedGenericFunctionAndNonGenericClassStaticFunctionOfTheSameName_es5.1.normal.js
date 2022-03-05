import * as swcHelpers from "@swc/helpers";
var clodule = /*#__PURE__*/ function() {
    "use strict";
    function clodule() {
        swcHelpers.classCallCheck(this, clodule);
    }
    swcHelpers.createClass(clodule, null, [
        {
            key: "fn",
            value: function fn(id) {}
        }
    ]);
    return clodule;
}();
(function(clodule) {
    var fn = function fn(x, y) {
        return x;
    };
    clodule.fn = fn;
})(clodule || (clodule = {}));
