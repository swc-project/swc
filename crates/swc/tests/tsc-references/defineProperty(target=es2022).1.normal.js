//// [defineProperty.ts]
var x = "p";
let _x = x;
class A {
    a;
    b;
    c;
    ["computed"];
    [_x];
    m() {}
    constructor(y){
        this.y = y;
        this.a = this.y;
        this["computed"] = 13;
        this[_x] = 14;
        this.z = this.y;
    }
    z;
    y;
}
class B {
    a;
}
class C extends B {
    z;
    constructor(ka){
        super();
        this.ka = ka;
        this.z = this.ka;
        this.ki = this.ka;
    }
    ki;
    ka;
}
