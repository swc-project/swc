const c = (o)=>o;
const o = (o = c)=>o;
console.log(o() === o());
