import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x = function C() {
    "use strict";
    _class_call_check(this, C);
};
var y = {
    foo: function C2() {
        "use strict";
        _class_call_check(this, C2);
    }
};
var M;
(function(M) {
    var z = function C4() {
        "use strict";
        _class_call_check(this, C4);
    };
})(M || (M = {}));
