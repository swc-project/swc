import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var clodule = /*#__PURE__*/ function() {
    "use strict";
    function clodule() {
        _class_call_check(this, clodule);
    }
    clodule.sfn = function sfn(id) {
        return 42;
    };
    return clodule;
}();
(function(clodule1) {
    var fn = function fn(x, y) {
        return clodule.sfn("a");
    };
    clodule1.fn = fn;
})(clodule || (clodule = {}));
