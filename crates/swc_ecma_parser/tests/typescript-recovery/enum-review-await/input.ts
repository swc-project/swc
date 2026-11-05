export {};
enum E {
    Identifier = await,
    Binary = await + 1,
    Call = await(value),
    Member = await.value,
    In = await in values,
    InstanceOf = await instanceof Value,
    As = await as number,
    Satisfies = await satisfies number,
    LineBreak = await
        + 1,
    Expression = await value,
    Number = await 1,
    BigInt = await 1n,
    String = await "value",
    Boolean = await true,
    Nested = await await + 1,
}
async function outer() {
    enum Local { Expression = await value, Identifier = await }
    await value;
}
