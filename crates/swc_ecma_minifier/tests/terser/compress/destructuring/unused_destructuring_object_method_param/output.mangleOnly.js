({
    baz({ w: o = console.log("side effect"), x: e, y: l }) {
        console.log(e);
    },
}.baz({ x: 7, y: 8, z: 9 }));
