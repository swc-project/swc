import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    _class_call_check(this, C), console.log(this);
}, D = function() {
    "use strict";
    _class_call_check(this, D), console.log(this);
}, E = function() {
    "use strict";
    function E() {
        _class_call_check(this, E);
    }
    return E.prototype.constructor = function() {
        console.log(this);
    }, E;
}();
new function _class() {
    "use strict";
    _class_call_check(this, _class), console.log(this);
};
var F = function() {
    "use strict";
    _class_call_check(this, F), console.log(this);
};
