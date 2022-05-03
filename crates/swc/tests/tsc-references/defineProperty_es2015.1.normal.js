// @target: es5, esnext
// @useDefineForClassFields: true
var x = "p";
var _key;
class A {
    m() {}
    constructor(y){
        this.y = y;
        this.a = this.y;
        this["computed"] = 13;
        this[_key] = 14;
        this.z = this.y;
    }
}
_key = x;
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
