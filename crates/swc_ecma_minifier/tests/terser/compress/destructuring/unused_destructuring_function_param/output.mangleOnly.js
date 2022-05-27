function a({ w: b = console.log("side effect") , x: a , y: c  }) {
    console.log(a);
}
a({
    x: 1,
    y: 2,
    z: 3
});
