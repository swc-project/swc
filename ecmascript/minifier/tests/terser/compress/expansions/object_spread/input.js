let obj = { ...{} };
console.log(Object.keys(obj));
let objWithKeys = { a: 1, ...{ b: 2 } };
console.log(Object.keys(objWithKeys).join(","));
