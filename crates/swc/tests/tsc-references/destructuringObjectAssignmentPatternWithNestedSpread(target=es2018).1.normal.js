//// [destructuringObjectAssignmentPatternWithNestedSpread.ts]
let a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
({ x: { a , ...b } = d  } = c);
