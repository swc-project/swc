//// [typedefTagWrapping.ts]
//// [mod1.js]
function callIt(func, arg) {
    return func(arg);
}
//// [mod2.js]
function check(obj) {
    return obj.boo ? obj.num : obj.str;
}
//// [mod3.js]
function use1(func, bool, str, num) {
    return func(bool, str, num);
}
//// [mod4.js]
function use2(func, bool, str, num) {
    return func(bool, str, num);
}
//// [mod5.js]
function check5(obj) {
    return obj.boo ? obj.num : obj.str;
}
//// [mod6.js]
function check6(obj) {
    return obj.foo;
}
//// [mod7.js]
