import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
function f1(x) {
    if (swcHelpers._instanceof(x, C)) {
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
