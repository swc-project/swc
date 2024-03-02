//// [uniqueSymbolsDeclarationsInJs.js]
class C {
    static{
        this.readonlyStaticCall = Symbol();
    }
    static{
        this.readonlyStaticTypeAndCall = Symbol();
    }
    static{
        this.readwriteStaticCall = Symbol();
    }
    constructor(){
        this.readonlyCall = Symbol(), this.readwriteCall = Symbol();
    }
}
Symbol();
