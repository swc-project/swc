//// [uniqueSymbolsDeclarationsInJs.js]
// classes
class C {
    static{
        /**
     * @readonly
     */ this.readonlyStaticCall = Symbol();
    }
    static{
        /**
     * @type {unique symbol}
     * @readonly
     */ this.readonlyStaticTypeAndCall = Symbol();
    }
    static{
        this.readwriteStaticCall = Symbol();
    }
    constructor(){
        /**
     * @readonly
     */ this.readonlyCall = Symbol();
        this.readwriteCall = Symbol();
    }
}
/** @type {unique symbol} */ const a = Symbol();
