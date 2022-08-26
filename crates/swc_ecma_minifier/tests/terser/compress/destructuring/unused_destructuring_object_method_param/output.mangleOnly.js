({
    baz ({ w: e = console.log("side effect") , x: z , y: a  }) {
        console.log(z);
    }
}.baz({
    x: 7,
    y: 8,
    z: 9
}));
