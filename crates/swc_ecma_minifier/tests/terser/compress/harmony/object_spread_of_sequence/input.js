var a = { x: 1 };
console.log({ ...(a, a) });
console.log({ ...a, a: a });
console.log({ ...(a || a) });
console.log({ ...(a || a) });
