enum E {
    Await = await of,
    Yield = yield of,
    AwaitParenthesized = (await of),
    YieldCall = f(yield of),
    AwaitComputed = values[await of],
}
function* outer() {
    enum Local { Value = yield of }
    yield value;
}
