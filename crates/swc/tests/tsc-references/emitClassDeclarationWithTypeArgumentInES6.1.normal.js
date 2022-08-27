//// [emitClassDeclarationWithTypeArgumentInES6.ts]
class B {
    foo() {
        return this.x;
    }
    get BB() {
        return this.B;
    }
    set BBWith(c) {
        this.B = c;
    }
    constructor(a){
        this.B = a;
    }
}
