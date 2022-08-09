({
    baz ({ w: z = console.log("side effect") , x: a , y: b  }) {
        console.log(a);
    }
}.baz({
    x: 7,
    y: 8,
    z: 9
}));
