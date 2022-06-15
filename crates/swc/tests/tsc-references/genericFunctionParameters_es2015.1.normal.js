let x1 = f1((x)=>x); // {}
let x2 = f2((x)=>x); // number
let x3 = f3((x)=>x); // Array<any>
const x = s((a)=>a.init()); // x is any, should have been {}
