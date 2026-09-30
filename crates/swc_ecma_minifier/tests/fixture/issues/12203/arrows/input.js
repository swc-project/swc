const f = (a = undefined) => a;
const g = (a, b = void 0, c) => [a, b, c];
const h = async (a = undefined) => a;
console.log(f(2), f.length);
console.log(g.length, g(1, 2, 3).join(","));
console.log(h.length);
