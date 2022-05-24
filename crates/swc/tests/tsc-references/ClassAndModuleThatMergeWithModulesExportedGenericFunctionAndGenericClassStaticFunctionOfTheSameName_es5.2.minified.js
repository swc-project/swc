import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var clodule = function() {
    "use strict";
    function clodule() {
        _class_call_check(this, clodule);
    }
    return clodule.fn = function(id) {}, clodule;
}();
(clodule || (clodule = {})).fn = function(x, y) {
    return x;
};
