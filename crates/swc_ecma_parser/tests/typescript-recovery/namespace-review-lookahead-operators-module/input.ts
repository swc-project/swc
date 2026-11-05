namespace N {
    const await = 1;
    const values = {};
    class C {}
    const AwaitAs = await as number;
    const AwaitSatisfies = await satisfies number;
    const AwaitConst = await as const;
    const AwaitIn = await in values;
    const AwaitInstanceof = await instanceof C;
    const AwaitLiteralType = await as 1;
    const AwaitTupleType = await as [number, string];
    const AwaitFunctionType = await as (() => number);
    const AwaitTypeQuery = await as typeof values;
    const EscapedAwaitAs = a\u0077ait as number;
    const AwaitAsComment = await as /* type */ number;
    const AwaitAsUnicodeTrivia = await as number;
    const AwaitAsEscapedType = await as \u0043;
    const AwaitAsNegativeLiteral = await as -1;
    const AwaitAsUnion = await as | number | string;
}
