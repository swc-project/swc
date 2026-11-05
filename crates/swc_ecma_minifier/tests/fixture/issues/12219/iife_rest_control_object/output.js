var f = ((...r)=>()=>r[0])({});
console.log(f() === f());
