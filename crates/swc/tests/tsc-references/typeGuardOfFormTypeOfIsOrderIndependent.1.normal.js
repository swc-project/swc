//// [typeGuardOfFormTypeOfIsOrderIndependent.ts]
var strOrNum;
var strOrBool;
var strOrFunc;
var numOrBool;
var str;
var num;
var bool;
var func;
if ("string" === typeof strOrNum) {
    str = strOrNum;
} else {
    num = strOrNum;
}
if ("function" === typeof strOrFunc) {
    func = strOrFunc;
} else {
    str = strOrFunc;
}
if ("number" === typeof numOrBool) {
    num = numOrBool;
} else {
    bool = numOrBool;
}
if ("boolean" === typeof strOrBool) {
    bool = strOrBool;
} else {
    str = strOrBool;
}
