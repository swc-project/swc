//// [mergedInterfacesWithMultipleBases.ts]
// merged interfaces behave as if all extends clauses from each declaration are merged together
// no errors expected
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
var a;
var r = a.a;
// generic interfaces in a module
var M;
(function(M) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var C2 = function C2() {
        "use strict";
        _class_call_check(this, C2);
    };
    var D = function D() {
        "use strict";
        _class_call_check(this, D);
    };
})(M || (M = {}));
