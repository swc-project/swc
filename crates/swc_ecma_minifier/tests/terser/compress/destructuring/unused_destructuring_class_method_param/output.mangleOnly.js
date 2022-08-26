new (class {
    baz({ w: e = console.log("side effect") , x: a , y: l  }) {
        console.log(a);
    }
})().baz({
    x: 7,
    y: 8,
    z: 9
});
