let f = (a)=>a;
f &&= (a, b)=>b;
console.log(f(1, 2));
