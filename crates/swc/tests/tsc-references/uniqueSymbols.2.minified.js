//// [uniqueSymbols.ts]
const constCall = Symbol();
Symbol(), Symbol(), Symbol();
class C {
    static readonlyStaticCall = Symbol();
    static readonlyStaticTypeAndCall = Symbol();
    static readwriteStaticCall = Symbol();
    readonlyCall = Symbol();
    readwriteCall = Symbol();
}
C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, c.readonlyCall, c.readwriteCall, c.readonlyCall, c.readwriteCall, c.readonlyCall, c.readwriteCall, i.readonlyType, i.readonlyType, i.readonlyType, l.readonlyType, l.nested.readonlyNestedType, l.readonlyType, l.nested.readonlyNestedType, l.readonlyType, l.nested.readonlyNestedType, Promise.resolve(constCall), f(s), f(N.s), f(N.s), N.s, N.s, N.s, N.s, o[s], o[N.s], o[N.s], f(s), f(N.s), f(N.s), g(s), g(N.s), g(N.s), N.s, N.s, 2 * Math.random() && N.s, 2 * Math.random() && N.s, N.s;
