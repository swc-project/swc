// @declaration: true
function f1() {
    let x1 = new Mixed1("hello");
    let x2 = new Mixed1(42);
    let x3 = new Mixed2("hello");
    let x4 = new Mixed2(42);
    let x5 = new Mixed3("hello");
    let x6 = new Mixed3(42);
    let x7 = new Mixed4("hello");
    let x8 = new Mixed4(42);
    let x9 = new Mixed5();
}
function f2() {
    let x = new Mixed1("hello");
    x.a;
    x.p;
    Mixed1.p;
}
function f3() {
    let x = new Mixed2("hello");
    x.a;
    x.p;
    Mixed2.p;
}
function f4() {
    let x = new Mixed3("hello");
    x.a;
    x.p;
    x.f();
    Mixed3.p;
    Mixed3.f();
}
function f5() {
    let x = new Mixed4("hello");
    x.a;
    x.p;
    x.f();
    Mixed4.p;
    Mixed4.f();
}
function f6() {
    let x = new Mixed5();
    x.p;
    x.f();
    Mixed5.p;
    Mixed5.f();
}
class C2 extends Mixed1 {
    constructor(){
        super("hello");
        this.a;
        this.b;
        this.p;
    }
}
class C3 extends Mixed3 {
    f() {
        return super.f();
    }
    constructor(){
        super(42);
        this.a;
        this.b;
        this.p;
        this.f();
    }
}
