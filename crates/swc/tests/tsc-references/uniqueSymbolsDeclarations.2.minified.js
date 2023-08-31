//// [uniqueSymbolsDeclarations.ts]
// declarations with call initializer
const constCall = Symbol();
Symbol(), Symbol(), Symbol(), constType, constType, constType, constType;
// classes
class C {
    static{
        this.readonlyStaticCall = Symbol();
    }
    static{
        this.readonlyStaticTypeAndCall = Symbol();
    }
    static{
        this.readwriteStaticCall = Symbol();
    }
    constructor(){
        this.readonlyCall = Symbol(), this.readwriteCall = Symbol();
    }
}
C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, c.readonlyCall, c.readwriteCall, c.readonlyCall, c.readwriteCall, c.readonlyCall, c.readwriteCall, i.readonlyType, i.readonlyType, i.readonlyType, l.readonlyType, l.nested.readonlyNestedType, l.readonlyType, l.nested.readonlyNestedType, l.readonlyType, l.nested.readonlyNestedType, Promise.resolve(constCall), // widening positions
// argument inference
f(s), f(N.s), f(N.s), s, N.s, N.s, s, N.s, N.s, (p = s)=>p;
// property initializers
class C0 {
    static{
        this.a = s;
    }
    static{
        this.b = N.s;
    }
    static{
        this.c = N.s;
    }
    static{
        this.d = s;
    }
    static{
        this.e = N.s;
    }
    static{
        this.f = N.s;
    }
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
    constructor(){
        this.a = s, this.b = N.s, this.c = N.s, this.d = s, this.e = N.s, this.f = N.s;
    }
}
// non-widening positions
// element access
o[s], o[N.s], o[N.s], // arguments (no-inference)
f(s), f(N.s), f(N.s), g(s), g(N.s), g(N.s), // falsy expressions
s, N.s, N.s, // conditionals
2 * Math.random() && s, 2 * Math.random() && N.s, 2 * Math.random() && N.s, s, N.s;
class C1 {
    static{
        N.s, N.s;
    }
}
