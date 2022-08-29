//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
let a, b, d;
({ x: { a , ...b } = d  } = {
    x: {
        a: 1,
        y: 2
    }
});
