const foo = { ...(null && {}) };
const bar = { ...null };

console.log(foo, bar);
