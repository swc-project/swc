({
    baz({ w: w = console.log("side effect"), x: x, y: z }) {
        console.log(x);
    },
}.baz({ x: 7, y: 8, z: 9 }));
