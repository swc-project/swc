// @strictNullChecks: true
// @declaration: true
function test1(x) {
    x.a;
    x.b;
    x.f;
    x.g;
    let f1 = x.f();
    let g1 = x.g && x.g();
    let g2 = x.g ? x.g() : 0;
}
class Bar {
    f() {
        return 1;
    }
    h() {
        return 2;
    }
    constructor(d, e = 10){
        this.d = d;
        this.e = e;
        this.c = 2;
    }
}
function test2(x) {
    x.a;
    x.b;
    x.c;
    x.d;
    x.e;
    x.f;
    x.g;
    let f1 = x.f();
    let g1 = x.g && x.g();
    let g2 = x.g ? x.g() : 0;
    let h1 = x.h && x.h();
    let h2 = x.h ? x.h() : 0;
}
class Base {
}
class Derived extends Base {
    f() {
        return 1;
    }
    constructor(...args){
        super(...args);
        this.a = 1;
    }
}
