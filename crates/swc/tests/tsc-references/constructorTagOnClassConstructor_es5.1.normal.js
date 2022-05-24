import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowJs: true
// @noEmit: true
// @checkJs: true
// @Filename: bug27025.js
export var Alpha = function Alpha() {
    "use strict";
    _class_call_check(this, Alpha);
};
export var Beta = function Beta() {
    "use strict";
    _class_call_check(this, Beta);
};
var arr = [
    Alpha,
    Beta
];
