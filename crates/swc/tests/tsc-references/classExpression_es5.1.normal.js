import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
