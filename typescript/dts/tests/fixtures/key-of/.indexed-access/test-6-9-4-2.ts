function f71(func: <T, U>(x: T, y: U) => Partial<T & U>) {
    let x = func({ a: 1, b: "hello" }, { c: true });
    const r1 = x.a;  // number | undefined
    const r2 = x.b;  // string | undefined
    const r3 = x.c;  // boolean | undefined

    return { r1, r2, r3 }
}
