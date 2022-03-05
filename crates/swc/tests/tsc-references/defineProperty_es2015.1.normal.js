// @target: es5, esnext
// @useDefineForClassFields: true
var x = "p";
let _x = x;
class A {
    m() {}
    constructor(y){
        this.y = y;
        this.a = this.y;
        this["computed"] = 13;
        this[_x] = 14;
        this.z = this.y;
    }
}
class B {
}
class C extends B {
    constructor(ka){
        super();
        this.ka = ka;
        this.z = this.ka;
        this.ki = this.ka;
    }
}
