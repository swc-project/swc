const callbacks = [];
let i = 0;
for(; i < 3 && callbacks.push(((value)=>()=>value)(++i)););
console.log(callbacks.map((cb)=>cb()).join(","));
