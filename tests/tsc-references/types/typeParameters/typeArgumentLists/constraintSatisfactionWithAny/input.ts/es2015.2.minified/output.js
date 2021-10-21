var a, b;
function foo(x) {
    return null;
}
function foo2(x) {
    return null;
}
function foo4(x) {
    return null;
}
foo(a), foo2(a), foo4(a), foo(b), foo2(b), foo4(b);
class C {
    constructor(x){
        this.x = x;
    }
}
new C(a), new C(b);
class C2 {
    constructor(x1){
        this.x = x1;
    }
}
new C2(a), new C2(b);
class C4 {
    constructor(x2){
        this.x = x2;
    }
}
new C4(a), new C4(b);
