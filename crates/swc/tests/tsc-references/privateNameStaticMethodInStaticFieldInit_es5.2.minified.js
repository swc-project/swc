import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.s = swcHelpers.classStaticPrivateMethodGet(C, C, function() {
    return 42;
}).call(C), console.log(C.s);
