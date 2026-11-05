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

expect(Values.Postfix).toBe(1);
expect(Values.Prefix).toBe(3);
expect(Values.TypedPrefix).toBe(4);
expect(Values.Assigned).toBe(7);
expect(Values.Deleted).toBe(1);
expect(Object.hasOwn(Values, "A")).toBe(false);
expect(Iterated.Last).toBe(3);
