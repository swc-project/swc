import * as swcHelpers from "@swc/helpers";
var X = function X() {
    "use strict";
    swcHelpers.classCallCheck(this, X);
    swcHelpers.classStaticPrivateMethodGet(X, X, m).call(X);
};
var _f = {
    writable: true,
    value: swcHelpers.classStaticPrivateMethodGet(X, X, m).call(X)
};
function m() {
    var X1 = {}; // shadow the class
    var _a = {}; // shadow the first generated var
    swcHelpers.classStaticPrivateMethodGet(X1, X, m).call(X); // Should check with X as the receiver with _b as the class constructor 
    return 1;
}
