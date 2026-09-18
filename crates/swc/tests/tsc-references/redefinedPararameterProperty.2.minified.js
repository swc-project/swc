//// [redefinedPararameterProperty.ts]
class Base {
    a = 1;
}
class Derived extends Base {
    a;
    b = this.a;
    constructor(a){
        super(), this.a = a;
    }
}
