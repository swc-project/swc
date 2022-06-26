import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
