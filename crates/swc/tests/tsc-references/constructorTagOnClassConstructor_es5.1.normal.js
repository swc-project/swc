import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @noEmit: true
// @checkJs: true
// @Filename: bug27025.js
export var Alpha = function Alpha() {
    "use strict";
    swcHelpers.classCallCheck(this, Alpha);
};
export var Beta = function Beta() {
    "use strict";
    swcHelpers.classCallCheck(this, Beta);
};
var arr = [
    Alpha,
    Beta
];
