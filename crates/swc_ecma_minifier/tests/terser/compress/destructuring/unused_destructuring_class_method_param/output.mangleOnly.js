new (class {
    baz({ w: e = console.log("side effect"), x: o, y: l }) {
        console.log(o);
    }
})().baz({ x: 7, y: 8, z: 9 });
