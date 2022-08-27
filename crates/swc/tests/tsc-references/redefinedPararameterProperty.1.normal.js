//// [redefinedPararameterProperty.ts]
class Base {
    a = 1;
}
class Derived extends Base {
    b;
    constructor(a){
        super();
        this.a = a;
        this.b = this.a /*undefined*/ ;
    }
    a;
}
