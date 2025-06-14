//// [defineProperty.ts]
var x = "p";
class A {
    y;
    a = this.y;
    b;
    c;
    ["computed"] = 13;
    [x] = 14;
    m() {}
    constructor(y){
        this.y = y;
    }
    z = this.y;
}
class B {
    a;
}
class C extends B {
    ka;
    z = this.ka;
    constructor(ka){
        super(), this.ka = ka;
    }
    ki = this.ka;
}
