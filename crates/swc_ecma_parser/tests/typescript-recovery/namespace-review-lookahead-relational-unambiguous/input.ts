namespace N {
    const AwaitAsIn = await as in values;
    const AwaitSatisfiesIn = await satisfies in values;
    const AwaitAsInstanceof = await as instanceof Constructor;
    const AwaitSatisfiesInstanceof = await satisfies instanceof Constructor;
    const YieldAsIn = yield as in values;
    const YieldSatisfiesIn = yield satisfies in values;
    const YieldAsInstanceof = yield as instanceof Constructor;
    const YieldSatisfiesInstanceof = yield satisfies instanceof Constructor;
    const AwaitAsComment = await as /* operand */ in values;
    const YieldSatisfiesComment = yield satisfies /* operand */ instanceof Constructor;
    const AwaitSatisfiesUnicode = await satisfies in values;
    const YieldAsUnicode = yield as instanceof Constructor;
    const AwaitAsGrouped = (await as in values);
    const YieldSatisfiesGrouped = (yield satisfies in values);
}
