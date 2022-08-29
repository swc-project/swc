//// [emitDefaultParametersMethodES6.ts]
class C {
    foo(x, t = false) {}
    foo1(x, t = false, ...rest) {}
    bar(t = false) {}
    boo(t = false, ...rest) {}
    constructor(t, z, x, y = "hello"){}
}
class D {
    constructor(y = "hello"){}
}
class E {
    constructor(y = "hello", ...rest){}
}
