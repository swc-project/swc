import * as swcHelpers from "@swc/helpers";
var A1 = function A1() {
    "use strict";
    swcHelpers.classCallCheck(this, A1);
    swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1, "");
    swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1, 1) // Error
    ;
    swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1) // Error 
    ;
};
function method(param) {
    return "";
}
