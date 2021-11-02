function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    /**
     * @readonly
     */ // @target: esnext
    // @lib: esnext
    // @declaration: true
    // @allowJs: true
    // @checkJs: true
    // @filename: uniqueSymbolsDeclarationsInJs.js
    // @out: uniqueSymbolsDeclarationsInJs-out.js
    // classes
    this.readonlyCall = Symbol();
    this.readwriteCall = Symbol();
};
C.readonlyStaticCall = Symbol();
C.readonlyStaticTypeAndCall = Symbol();
C.readwriteStaticCall = Symbol();
