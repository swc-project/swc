//// [emitDefaultParametersMethodES6.ts]
class C {
    foo(x, t = !1) {}
    foo1(x, t = !1, ...rest) {}
    bar(t = !1) {}
    boo(t = !1, ...rest) {}
    constructor(t, z, x, y = "hello"){}
}
class D {
    constructor(y = "hello"){}
}
class E {
    constructor(y = "hello", ...rest){}
}
