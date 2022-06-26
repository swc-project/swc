function a({ w: a = console.log("side effect") , x: b , y: c  }) {
    console.log(b);
}
a({
    x: 1,
    y: 2,
    z: 3
});
