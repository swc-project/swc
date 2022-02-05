// @noTypesAndSymbols: true
// @strictNullChecks: true
// @target: esnext
// @useDefineForClassFields: true
class Base {
    constructor(){
        this.a = 1;
    }
}
class Derived extends Base {
    constructor(a){
        super();
        this.a = a;
        this.b = this.a /*undefined*/ ;
    }
}
