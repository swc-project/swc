function fnReturn1() {
    return fnReturn1();
}
function fnReturn2() {
    return fnReturn2;
}
fnReturn1(), fnReturn2();
var co2, cnd1, or3, and3, propAcc1, M2, co2 = co2, cnd1 = cnd1 ? 0 : 1, or3 = or3 || or3, and3 = and3 && and3;
function fnCall() {
    return fnCall();
}
function fnArg1(x, y) {
    fnArg1(fnArg1, 0);
}
function fn5() {
    return new (void 0)(fn5);
}
fnCall(), fn5();
var propAcc1 = {
    m: propAcc1.m
};
(M2 || (M2 = {
})).x = M2.x, new class {
    constructor(){
        this.n = this.n;
    }
}().n;
class C3 {
}
C3.q = C3.q;
