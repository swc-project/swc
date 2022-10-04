

async function b() { return "bar"; }

let x;
let a;

a = async () => { x = ""; x += await b(); return x; }

console.log(await a());