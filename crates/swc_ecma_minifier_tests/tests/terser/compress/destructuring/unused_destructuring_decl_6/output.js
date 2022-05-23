const { a: a, b: c, ...d } = { b: 7 };
let { e: e, f: g, ...h } = { e: 8 };
var { w: w, x: y, ...z } = { w: 4, x: 5, y: 6 };
console.log(c, e, z.y);
