let a = async (a)=>await foo(a);
let t = async ()=>await bar();
let y = async (a)=>await baz(a);
let c = async (a, t)=>{
    await far(a, t);
};
let e = async ({ x: a = [
    1
] , y: t = 2  })=>{
    await wow(a, t);
};
