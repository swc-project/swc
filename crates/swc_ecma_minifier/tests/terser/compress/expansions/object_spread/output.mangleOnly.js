let e = { ...{} };
console.log(Object.keys(e));
let o = { a: 1, ...{ b: 2 } };
console.log(Object.keys(o).join(","));
