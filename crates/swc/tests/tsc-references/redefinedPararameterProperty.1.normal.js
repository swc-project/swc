//// [redefinedPararameterProperty.ts]
class Base {
    a = 1;
}
class Derived extends Base {
    a;
    b;
    constructor(a){
        super(), this.a = a, this.b = this.a /*undefined*/ ;
    }
}
