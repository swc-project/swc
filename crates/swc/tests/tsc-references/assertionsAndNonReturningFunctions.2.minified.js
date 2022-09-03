//// [assertionsAndNonReturningFunctions.js]
var assert = function(check) {
    if (!check) throw Error();
};
function assertIsString(x) {
    if ("string" != typeof x) throw Error();
}
function assert2(check) {
    if (!check) throw Error();
}
function fail() {
    throw Error();
}
function f1(x) {
    assert("string" == typeof x), x.length, assert2("string" == typeof x), x.length, assertIsString(x), x.length, fail();
}
function f2(b) {
    switch(b){
        case !0:
            return 1;
        case !1:
            return 0;
    }
}
