let out = [],
    foo = (out.push(0), 1),
    { prop: prop } = (out.push(2), out.push(3), { prop: 8 }),
    baz = (out.push(4), 5);
console.log(`${foo} ${prop} ${baz} ${JSON.stringify(out)}`);
