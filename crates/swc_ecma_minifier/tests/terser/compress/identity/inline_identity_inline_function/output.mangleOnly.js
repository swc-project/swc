const a = (a)=>a;
console.log(a((a)=>a + 1)(1), a(((a)=>a + 1)(2)));
