// basic uses of specialized signatures without errors
class Base {
}
class Derived1 extends Base {
}
class Derived2 extends Base {
}
class C {
    constructor(x){
        return x;
    }
}
var c = new C('a');
var i;
var a;
c = i;
c = a;
i = a;
a = i;
var r1 = new C('hi');
var r2 = new i('bye');
var r3 = new a('hm');
