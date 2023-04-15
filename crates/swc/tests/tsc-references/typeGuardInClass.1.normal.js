//// [typeGuardInClass.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x;
if (typeof x === "string") {
    var n = function n() {
        "use strict";
        _class_call_check(this, n);
        var y = x;
    };
} else {
    var m = function m() {
        "use strict";
        _class_call_check(this, m);
        var y = x;
    };
}
