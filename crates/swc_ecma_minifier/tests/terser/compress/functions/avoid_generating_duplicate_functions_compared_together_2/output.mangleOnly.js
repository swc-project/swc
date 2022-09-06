const o = (o) => o;
const c = (c = o) => c;
console.log(c() === c());
