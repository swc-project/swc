//// [equalityStrictNulls.ts]
function f1(x) {}
function f2() {}
function f3(a, b, c, d) {}
function f4(x) {}
function f5(x) {
    switch(x){
        case null:
        case void 0:
            break;
        default:
            return;
    }
}
