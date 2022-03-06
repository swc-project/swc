import * as swcHelpers from "@swc/helpers";
var X = function() {
    "use strict";
    swcHelpers.classCallCheck(this, X), swcHelpers.classStaticPrivateMethodGet(X, X, m).call(X);
};
function m() {
    return swcHelpers.classStaticPrivateMethodGet({}, X, m).call(X), 1;
}
swcHelpers.classStaticPrivateMethodGet(X, X, m).call(X);
