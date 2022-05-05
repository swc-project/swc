function foo(baz) {
    for (const g in baz) {
        console.log(g);

        for (let j = 0; j < g.length; j++) {
            console.log(j);
        }
    }
}

console.log(
    foo({
        a: [1],
        b: [2, 2],
        c: [3, 3, 3],
    })
);
