class A {
    constructor(a){
        this.a = a;
    }
}
class B {
}
function acceptA(a) {
}
function acceptB(b) {
}
function test(x) {
    if (x instanceof B) {
        acceptA(x);
    }
    if (x instanceof A) {
        acceptA(x);
    }
    if (x instanceof B) {
        acceptB(x);
    }
    if (x instanceof B) {
        acceptB(x);
    }
}
