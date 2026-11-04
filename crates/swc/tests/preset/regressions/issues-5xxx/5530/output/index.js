async function* level1() {
    yield 1;
    yield 2;
    yield 3;
}
async function* level2() {
    yield* (0, level1());
}
async function* foo() {
    yield (foo, bar);
    await (foo, bar);
    yield* (0, level1());
    await (0, level1());
    yield foo ? bar : baz;
    await (foo ? bar : baz);
    yield ++foo;
    await ++foo;
    yield !foo;
    await !foo;
}
