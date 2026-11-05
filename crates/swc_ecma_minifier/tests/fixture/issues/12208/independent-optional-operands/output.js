const obj = {}, func = ()=>{}, get = (value)=>value;
console.log(obj?.[void 0]), console.log(func?.(void 0)), console.log(((value)=>value)(void 0)?.x), console.log(((value)=>value)(void 0)?.x.y), console.log(void 0), console.log(void 0), console.log(obj?.x);
