const a = (a)=>a;
const b = (b = a)=>b;
console.log(b() === b());
