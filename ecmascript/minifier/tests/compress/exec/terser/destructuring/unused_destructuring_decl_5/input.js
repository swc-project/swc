const { a: a, b: c, d: d = new Object(1) } = { b: 7 };
let { e: e, f: g, h: h = new Object(2) } = { e: 8 };
var { w: w, x: y, z: z = new Object(3) } = { w: 4, x: 5, y: 6 };
console.log(c, e, z + 0);
