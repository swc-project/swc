import * as swcHelpers from "@swc/helpers";
var anyCtor, anyCtor1, nestedCtor, C0 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C0);
}, C1 = function(n, s) {
    "use strict";
    swcHelpers.classCallCheck(this, C1);
}, T = function(n) {
    "use strict";
    swcHelpers.classCallCheck(this, T);
};
new C0, new T, new anyCtor, new anyCtor1(void 0), new function() {}();
var nested = new new new nestedCtor()()();
new nested(), new nested();
