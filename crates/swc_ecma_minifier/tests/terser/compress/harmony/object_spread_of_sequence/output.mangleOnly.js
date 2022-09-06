var o = { x: 1 };
console.log({ ...(o, o) });
console.log({ ...o, a: o });
console.log({ ...(o || o) });
console.log({ ...(o || o) });
