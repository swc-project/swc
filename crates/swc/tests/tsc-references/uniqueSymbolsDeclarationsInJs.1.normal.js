//// [uniqueSymbolsDeclarationsInJs.js]
// classes
class C {
    /**
     * @readonly
     */ static readonlyStaticCall = Symbol();
    /**
     * @type {unique symbol}
     * @readonly
     */ static readonlyStaticTypeAndCall = Symbol();
    static readwriteStaticCall = Symbol();
    /**
     * @readonly
     */ readonlyCall = Symbol();
    readwriteCall = Symbol();
}
