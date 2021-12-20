class A {
}
function B1() {
    return class extends A {
    };
}
class B2 {
    constructor(){
        this.anon = class extends A {
        };
    }
}
class K extends B1() {
}
class C extends new B2().anon {
}
let b3Number = class extends A {
};
var c = new C(), k = new K(), s = new class extends b3Number {
}();
c.genericVar = 12, k.genericVar = 12, s.genericVar = 12;
