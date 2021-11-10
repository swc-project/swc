var o = { x: 1, y: 2 },
    l = { ...o },
    x = { ...o, x: 3, z: 4 };
console.log(l, x);
