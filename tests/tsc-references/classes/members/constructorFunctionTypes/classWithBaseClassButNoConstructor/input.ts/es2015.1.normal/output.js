class Base {
    constructor(x){
    }
}
class C extends Base {
}
var r = C;
var c = new C(); // error
var c2 = new C(1); // ok
class Base2 {
    constructor(x1){
    }
}
class D extends Base2 {
}
var r2 = D;
var d = new D(); // error
var d2 = new D(1); // ok
// specialized base class
class D2 extends Base2 {
}
var r3 = D2;
var d3 = new D(); // error
var d4 = new D(1); // ok
class D3 extends Base2 {
}
var r4 = D3;
var d5 = new D(); // error
var d6 = new D(1); // ok
