class A {
}
function B1() {
    // class expression can use T
    return class extends A {
    };
}
class B2 {
    constructor(){
        this.anon = class extends A {
        };
    }
}
function B3() {
    return class Inner extends A {
    };
}
// extends can call B
class K extends B1() {
}
class C extends new B2().anon {
}
let b3Number = B3();
class S extends b3Number {
}
var c = new C();
var k = new K();
var s = new S();
c.genericVar = 12;
k.genericVar = 12;
s.genericVar = 12;
