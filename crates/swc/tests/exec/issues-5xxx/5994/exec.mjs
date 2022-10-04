

async function b() { return "bar"; }

a = async () => { x = ""; x += await b(); return x; }

console.log(await a());