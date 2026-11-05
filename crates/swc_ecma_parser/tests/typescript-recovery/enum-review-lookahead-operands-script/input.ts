enum E {
    AwaitAs = await as,
    AwaitSatisfies = await satisfies,
    YieldAs = yield as,
    YieldSatisfies = yield satisfies,
    AwaitAsMember = await as.value,
    YieldSatisfiesMember = yield satisfies.value,
    AwaitAsCall = await as(),
    YieldSatisfiesCall = yield satisfies(),
    AwaitAsAddition = await as + 1,
    YieldSatisfiesAddition = yield satisfies + 1,
}
