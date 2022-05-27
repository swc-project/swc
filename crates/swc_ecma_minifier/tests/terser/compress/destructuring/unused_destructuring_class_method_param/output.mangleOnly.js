new (class {
    baz({ w: b = console.log("side effect") , x: a , y: c  }) {
        console.log(a);
    }
})().baz({
    x: 7,
    y: 8,
    z: 9
});
