//// [redefinedPararameterProperty.ts]
class Base {
    a = 1;
}
class Derived extends Base {
    a;
    b = this.a /*undefined*/ ;
    constructor(a){
        super(), this.a = a;
    }
}
