//// [classExpression.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
(function(M) {
    var z = function C4() {
        "use strict";
        _class_call_check(this, C4);
    };
})(M || (M = {}));
var M;
