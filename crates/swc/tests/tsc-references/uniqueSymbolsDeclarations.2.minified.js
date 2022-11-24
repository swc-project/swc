//// [uniqueSymbolsDeclarations.ts]
const constCall = Symbol();
Symbol(), Symbol(), Symbol();
class C {
    static readonlyStaticCall = Symbol();
    static readonlyStaticTypeAndCall = Symbol();
    static readwriteStaticCall = Symbol();
    readonlyCall = Symbol();
    readwriteCall = Symbol();
}
C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, c.readonlyCall, c.readwriteCall, c.readonlyCall, c.readwriteCall, c.readonlyCall, c.readwriteCall, i.readonlyType, i.readonlyType, i.readonlyType, l.readonlyType, l.nested.readonlyNestedType, l.readonlyType, l.nested.readonlyNestedType, l.readonlyType, l.nested.readonlyNestedType, Promise.resolve(constCall), f(s), f(N.s), f(N.s), N.s, N.s, N.s, N.s, (p = s)=>p;
class C0 {
    static a = s;
    static b = N.s;
    static c = N.s;
    static d = s;
    static e = N.s;
    static f = N.s;
    a = s;
    b = N.s;
    c = N.s;
    d = s;
    e = N.s;
    f = N.s;
    method1() {
        return s;
    }
    async method2() {
        return s;
    }
    async *method3() {
        yield s;
    }
    *method4() {
        yield s;
    }
    method5(p = s) {
        return p;
    }
}
o[s], o[N.s], o[N.s], f(s), f(N.s), f(N.s), g(s), g(N.s), g(N.s), N.s, N.s, 2 * Math.random() && N.s, 2 * Math.random() && N.s, N.s;
