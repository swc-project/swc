var _key, _key1;
// @target: es5, esnext
// @useDefineForClassFields: true
var x = "p";
class A {
    m() {
    }
    constructor(y){
        this.y = y;
        this.a = this.y;
        this[_key] = 13;
        this[_key1] = 14;
        this.z = this.y;
    }
}
_key = "computed";
_key1 = x;
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
