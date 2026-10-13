namespace N {
    const await = 1;
    const values = {};
    class C {}
    const yield = 1;
    const AwaitAs = await as number;
    const YieldAs = yield as number;
    const AwaitSatisfies = await satisfies number;
    const YieldSatisfies = yield satisfies number;
    const AwaitConst = await as const;
    const YieldConst = yield as const;
    const AwaitIn = await in values;
    const YieldIn = yield in values;
    const AwaitInstanceof = await instanceof C;
    const YieldInstanceof = yield instanceof C;
    const AwaitLiteralType = await as 1;
    const YieldLiteralType = yield as 1;
    const AwaitTupleType = await as [number, string];
    const YieldTupleType = yield as [number, string];
    const AwaitFunctionType = await as (() => number);
    const YieldFunctionType = yield as (() => number);
    const AwaitTypeQuery = await as typeof values;
    const YieldTypeQuery = yield as typeof values;
    const EscapedAwaitAs = a\u0077ait as number;
    const EscapedYieldAs = y\u0069eld as number;
    const AwaitAsComment = await as /* type */ number;
    const AwaitAsUnicodeTrivia = await as number;
    const AwaitAsEscapedType = await as \u0043;
    const AwaitAsNegativeLiteral = await as -1;
    const AwaitAsUnion = await as | number | string;
    const YieldAsComment = yield as /* type */ number;
    const YieldAsUnicodeTrivia = yield as number;
    const YieldAsEscapedType = yield as \u0043;
    const YieldAsNegativeLiteral = yield as -1;
    const YieldAsUnion = yield as | number | string;
}
