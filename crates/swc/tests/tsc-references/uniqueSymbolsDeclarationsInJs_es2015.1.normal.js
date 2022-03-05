// @target: esnext
// @lib: esnext
// @declaration: true
// @allowJs: true
// @checkJs: true
// @filename: uniqueSymbolsDeclarationsInJs.js
// @out: uniqueSymbolsDeclarationsInJs-out.js
// @useDefineForClassFields: false
// classes
class C {
    constructor(){
        /**
     * @readonly
     */ this.readonlyCall = Symbol();
        this.readwriteCall = Symbol();
    }
}
/**
     * @readonly
     */ C.readonlyStaticCall = Symbol();
/**
     * @type {unique symbol}
     * @readonly
     */ C.readonlyStaticTypeAndCall = Symbol();
C.readwriteStaticCall = Symbol();
