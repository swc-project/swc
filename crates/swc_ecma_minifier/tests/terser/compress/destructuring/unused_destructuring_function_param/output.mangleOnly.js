function o({ w: e = console.log("side effect"), x: c, y: l }) {
    console.log(c);
}
o({
    x: 1,
    y: 2,
    z: 3
});
