//// [uniqueSymbolsDeclarationsInJs.js]
class C {
    static readonlyStaticCall = Symbol();
    static readonlyStaticTypeAndCall = Symbol();
    static readwriteStaticCall = Symbol();
    readonlyCall = Symbol();
    readwriteCall = Symbol();
}
const a = Symbol();
