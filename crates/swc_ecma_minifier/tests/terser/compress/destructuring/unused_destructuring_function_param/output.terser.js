function foo({ w: w = console.log("side effect"), x: x }) {
    console.log(x);
}
foo({ x: 1, y: 2, z: 3 });
