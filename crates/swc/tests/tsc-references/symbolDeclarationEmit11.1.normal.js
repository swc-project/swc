//// [symbolDeclarationEmit11.ts]
var __ = new WeakMap();
class C {
    static [Symbol.isConcatSpreadable]() {}
    static get [Symbol.toPrimitive]() {
        return "";
    }
    static set [Symbol.toPrimitive](x) {}
}
__.set(C, {
    writable: true,
    value: C[Symbol.iterator] = 0
});
