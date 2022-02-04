// @noTypesAndSymbols: true
// @strictNullChecks: true
// @target: esnext
// @useDefineForClassFields: true
class Base {
    constructor(){
        this.b = 1;
    }
}
class Derived extends Base {
    constructor(){
        super();
        this.d = this.b;
        this.b = 2;
    }
}
