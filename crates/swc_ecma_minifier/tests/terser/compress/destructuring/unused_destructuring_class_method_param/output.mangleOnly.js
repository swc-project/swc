new (class {
    baz({ w: a = console.log("side effect") , x: l , y: z  }) {
        console.log(l);
    }
})().baz({
    x: 7,
    y: 8,
    z: 9
});
