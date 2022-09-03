//// [emitClassDeclarationWithThisKeywordInES6.ts]
class B {
    static log(a) {}
    foo() {
        B.log(this.x);
    }
    get X() {
        return this.x;
    }
    set bX(y) {
        this.x = y;
    }
    constructor(){
        this.x = 10, this.x = 10;
    }
}
