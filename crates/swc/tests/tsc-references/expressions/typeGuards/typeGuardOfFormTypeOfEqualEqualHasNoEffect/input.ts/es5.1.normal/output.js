function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var strOrNum;
var strOrBool;
var numOrBool;
var strOrC;
// typeof x == s has not effect on typeguard
if (typeof strOrNum == "string") {
    var r1 = strOrNum; // string | number
} else {
    var r1 = strOrNum; // string | number
}
if (typeof strOrBool == "boolean") {
    var r2 = strOrBool; // string | boolean
} else {
    var r2 = strOrBool; // string | boolean
}
if (typeof numOrBool == "number") {
    var r3 = numOrBool; // number | boolean
} else {
    var r3 = numOrBool; // number | boolean
}
if ((typeof strOrC === "undefined" ? "undefined" : _typeof(strOrC)) == "Object") {
    var r4 = strOrC; // string | C
} else {
    var r4 = strOrC; // string | C
}
