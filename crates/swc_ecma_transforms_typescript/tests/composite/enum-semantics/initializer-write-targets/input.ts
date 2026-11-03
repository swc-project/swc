enum Values {
    A = 1,
    Postfix = A++,
    Prefix = ++A,
    TypedPrefix = ++(A as any),
    Assigned = (A = 7),
    Deleted = +(delete (A)),
}

enum Iterated {
    A = 1,
    Last = (() => {
        for ((A) of [2, 3]) {}
        return Reflect.get(Iterated, "A");
    })(),
}
