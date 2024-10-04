//// [defineProperty.ts]
var x = "p";
class A {
    y;
    a;
    b;
    c;
    ["computed"];
    [_x = x];
    m() {}
    constructor(y){
        this.y = y;
        this.a = this.y;
        this["computed"] = 13;
        this[_x] = 14;
        this.z = this.y;
    }
    z;
}
class B {
    a;
}
class C extends B {
    ka;
    z;
    constructor(ka){
        super(), this.ka = ka, this.z = this.ka, this.ki = this.ka;
    }
    ki;
}
var _x;
