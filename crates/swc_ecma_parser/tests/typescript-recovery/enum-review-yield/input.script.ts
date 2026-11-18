function* outer() {
    enum E {
        Identifier = yield,
        Binary = yield + 1,
        Call = yield(value),
        Member = yield.value,
        In = yield in values,
        InstanceOf = yield instanceof Value,
        As = yield as number,
        Satisfies = yield satisfies number,
        LineBreak = yield
            + 1,
        Expression = yield value,
        Number = yield 1,
        BigInt = yield 1n,
        String = yield "value",
        Boolean = yield true,
        Nested = yield yield + 1,
    }
    yield value;
}
