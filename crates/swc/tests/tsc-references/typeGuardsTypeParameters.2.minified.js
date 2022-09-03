//// [typeGuardsTypeParameters.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function f1(x) {
    _instanceof(x, C) && x.prop;
}
function f2(x) {
    "string" == typeof x && x.length;
}
function fun(item) {
    var strings = [];
    for(var key in item){
        var value = item[key];
        "string" == typeof value && strings.push(value);
    }
}
