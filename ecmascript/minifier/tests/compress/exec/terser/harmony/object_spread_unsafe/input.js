var o1 = { x: 1, y: 2 };
var o2 = { x: 3, z: 4 };
var cloned = { ...o1 };
var merged = { ...o1, ...o2 };
console.log(cloned, merged);
