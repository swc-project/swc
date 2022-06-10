import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @target: esnext
// @lib: esnext
// @declaration: true
// @allowJs: true
// @checkJs: true
// @filename: uniqueSymbolsDeclarationsInJs.js
// @out: uniqueSymbolsDeclarationsInJs-out.js
// @useDefineForClassFields: false
// classes
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    /**
     * @readonly
     */ this.readonlyCall = Symbol();
    this.readwriteCall = Symbol();
};
/**
     * @readonly
     */ C.readonlyStaticCall = Symbol();
/**
     * @type {unique symbol}
     * @readonly
     */ C.readonlyStaticTypeAndCall = Symbol();
C.readwriteStaticCall = Symbol();
