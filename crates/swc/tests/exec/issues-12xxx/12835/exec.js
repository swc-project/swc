const { a, ...rest } = { a: 1, b: 2 };
console.log(a, rest);

function f({ x, ...others }) {
    return [x, others];
}
console.log(f({ x: 1, y: 2, z: 3 }));

let c, d;
({ c, ...d } = { c: 3, e: 4 });
console.log(c, d);

for (const { k, ...v } of [{ k: 1, l: 2 }]) {
    console.log(k, v);
}
