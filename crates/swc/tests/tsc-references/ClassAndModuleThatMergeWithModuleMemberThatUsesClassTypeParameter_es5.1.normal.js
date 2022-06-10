import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// all expected to be errors
var clodule1 = function clodule1() {
    "use strict";
    _class_call_check(this, clodule1);
};
(function(clodule1) {
    var f = function f(x) {};
})(clodule1 || (clodule1 = {}));
var clodule2 = function clodule2() {
    "use strict";
    _class_call_check(this, clodule2);
};
(function(clodule2) {
    var x;
    var D = function D() {
        "use strict";
        _class_call_check(this, D);
    };
})(clodule2 || (clodule2 = {}));
var clodule3 = function clodule3() {
    "use strict";
    _class_call_check(this, clodule3);
};
(function(clodule3) {
    var y = clodule3.y = {
        id: T
    };
})(clodule3 || (clodule3 = {}));
var clodule4 = function clodule4() {
    "use strict";
    _class_call_check(this, clodule4);
};
(function(clodule4) {
    var D = function D() {
        "use strict";
        _class_call_check(this, D);
    };
})(clodule4 || (clodule4 = {}));
