function foo(baz) {
    console.log(baz);
    for (const g in baz) {
        for (let j = 0; j < g.length; j++) {
            const b = a[j];
            const { k, f } = b;
            const l = f.findIndex((x) => x === k);
            const [x, y] = foo(a, b, c);
            for (const a of foos) {
                console.log(a);
            }
        }
    }
}


console.log(foo({
    a: 1,
    b: 2,
    c: 3
}))