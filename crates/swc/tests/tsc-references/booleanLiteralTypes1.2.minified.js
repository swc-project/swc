//// [booleanLiteralTypes1.ts]
function f1() {}
function f2(a, b) {}
function f3(a, b) {}
function f4(t, f) {}
function f5(b) {
    g(!0), g(!1), g(b);
}
function assertNever(x) {
    throw Error("Unexpected value");
}
function f10(x) {
    switch(x){
        case !0:
            return "true";
        case !1:
            return "false";
    }
}
function f11(x) {
    switch(x){
        case !0:
            return "true";
        case !1:
            return "false";
    }
    return assertNever(x);
}
function f12(x) {}
function f13(x) {}
function f20(x) {
    switch(x.kind){
        case !0:
            return x.a;
        case !1:
            return x.b;
    }
}
function f21(x) {
    switch(x.kind){
        case !0:
            return x.a;
        case !1:
            return x.b;
    }
    return assertNever(x);
}
