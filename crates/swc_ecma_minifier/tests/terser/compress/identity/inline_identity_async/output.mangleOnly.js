const a = (a)=>a;
a(async ()=>await 1)();
a(async (a)=>await console.log(2))();
