//// [ClassAndModuleThatMergeWithModuleMemberThatUsesClassTypeParameter.ts]
// all expected to be errors
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
    var y = {
        id: T
    };
    Object.defineProperty(clodule3, "y", {
        enumerable: true,
        get: function get() {
            return y;
        },
        set: function set(v) {
            y = v;
        }
    });
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
