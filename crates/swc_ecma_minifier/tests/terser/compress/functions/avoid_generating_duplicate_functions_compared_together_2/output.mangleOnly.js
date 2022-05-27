const b = (a)=>a;
const a = (a = b)=>a;
console.log(a() === a());
