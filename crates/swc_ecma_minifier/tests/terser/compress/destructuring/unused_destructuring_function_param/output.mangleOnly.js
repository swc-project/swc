function e({ w: e = console.log("side effect") , x: f , y: o  }) {
    console.log(f);
}
e({
    x: 1,
    y: 2,
    z: 3
});
