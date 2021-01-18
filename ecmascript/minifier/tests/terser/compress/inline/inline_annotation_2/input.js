const shouldInline = (n) => +n;
const a = shouldInline("42.0");
const b = shouldInline("abc");
console.log(a, b);
