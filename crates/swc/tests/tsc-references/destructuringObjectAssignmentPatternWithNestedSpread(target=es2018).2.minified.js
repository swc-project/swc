//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
let a, b;
({ x: { a, ...b } } = {
    x: {
        a: 1,
        y: 2
    }
});
