({
    baz ({ w: a = console.log("side effect") , x: b , y: c  }) {
        console.log(b);
    }
}.baz({
    x: 7,
    y: 8,
    z: 9
}));
