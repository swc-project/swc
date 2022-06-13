import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var clodule = /*#__PURE__*/ function() {
    "use strict";
    function clodule() {
        _class_call_check(this, clodule);
    }
    clodule.fn = function fn(id) {};
    return clodule;
}();
(function(clodule) {
    var fn = function fn(x, y) {
        return x;
    };
    clodule.fn = fn;
})(clodule || (clodule = {}));
