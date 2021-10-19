// @target: esnext
// @lib: esnext
// @declaration: true
// @allowJs: true
// @checkJs: true
// @filename: uniqueSymbolsDeclarationsInJs.js
// @out: uniqueSymbolsDeclarationsInJs-out.js
// classes
class C {
    constructor(){
        /**
     * @readonly
     */ this.readonlyCall = Symbol();
        this.readwriteCall = Symbol();
    }
}
C.readonlyStaticCall = Symbol();
C.readonlyStaticTypeAndCall = Symbol();
C.readwriteStaticCall = Symbol();
