let out = [],
    foo = (out.push(0), 1),
    {} = { k: 9 },
    bar = out.push(2),
    { unused: unused } = (out.push(3), { unused: 7 }),
    { a: b, prop: prop, w: w, x: y, z: z } = { prop: 8 },
    baz = (out.push(4), 5);
console.log(`${foo} ${prop} ${baz} ${JSON.stringify(out)}`);
