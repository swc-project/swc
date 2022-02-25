function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
function f1(x) {
    if (_instanceof(x, C)) {
        var v1 = x;
        var v2 = x;
        x.prop;
    }
}
function f2(x) {
    if (typeof x === "string") {
        var v1 = x;
        var v2 = x;
        x.length;
    }
}
// Repro from #13872
function fun(item) {
    var strings = [];
    for(var key in item){
        var value = item[key];
        if (typeof value === "string") {
            strings.push(value);
        }
    }
}
